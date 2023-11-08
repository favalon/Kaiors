import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import MainPage from '@/components/MainPage';
// import Header from 'components/Header';
import { PageData } from 'components/types';
import styles from '@/styles/MainPageList.module.css';
import LeftSideMenu from '@/components/LeftSideMenu';

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


    const [language, setLanguage] = useState('JP'); // 'en' for English, 'jp' for Japanese
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

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', width: '100%', backgroundColor: '#faf6f6', overflow: 'hidden'}}>
                {/* LeftSideMenu with fixed width of 5% */}
                <Box sx={{ width: '6%', flexShrink: 0}}>
                    <LeftSideMenu onSelect={handleMenuItemSelect} language={language} setLanguage={setLanguage}/>
                </Box>
                {/* MainPage taking the rest of the width */}
                <Box sx={{ flexGrow: 1, width: '95%' }}>
                    {Object.keys(pageData).length > 0 && (
                        <div className={styles.allWidth}>
                            <MainPage
                                language={language}
                                setShowHeader={setShowHeader}
                                selectedPage={selectedPage}
                                setSelectPage={setSelectedPage}
                            />
                        </div>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );

};

export default Home;
