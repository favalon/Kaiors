import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainPage from '@/components/MainPage';
import Header from 'components/Header';
import { PageData } from 'components/types';
import styles from '@/styles/MainPageList.module.css';

const fetchBasicValue = async () => {
    const response = await fetch('/basic_value.json');
    const data = await response.json();
    return data;
};


const Home: React.FC = () => {
    const theme = createTheme();
    const [selectedPage, setSelectedPage] = useState<string>("");
    const [pageData, setPageData] = useState<PageData>({} as PageData)
    const [showHeader, setShowHeader] = useState(true);


    const handleMenuItemSelect = (selectedItem: string) => {
        setSelectedPage(selectedItem);
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedPageData = localStorage.getItem("pageData");
            if (storedPageData) {
                setPageData(JSON.parse(storedPageData));
            } else {
                fetchBasicValue().then((data) => {
                    setPageData(data);
                    localStorage.setItem("pageData", JSON.stringify(data));
                });
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("pageData", JSON.stringify(pageData));
        }
    }, [pageData]);

    useEffect(() => {
        if (Object.keys(pageData).length === 0) {
            fetchBasicValue().then((data) => {
                setPageData(data);
                localStorage.setItem("pageData", JSON.stringify(data));
            });
        }
    }, [pageData]);



    return (
        <ThemeProvider theme={theme}>
            {showHeader && (
                <div>
                    <Header selectedPage={selectedPage} onMenuItemSelect={handleMenuItemSelect} />
                </div>
            )}
            {Object.keys(pageData).length > 0 && (
                <div className={styles.allWidth}>
                    <MainPage
                        setShowHeader={setShowHeader}
                        selectedPage={selectedPage}
                        setSelectPage={setSelectedPage}
                        pageData={pageData}
                        setPageData={setPageData}
                    />
                </div >
            )}
        </ThemeProvider>
    );

};

export default Home;
