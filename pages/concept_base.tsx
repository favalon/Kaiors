import React, { useState } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ReactMarkdown from "react-markdown";
import styles from "@/styles/Concept.module.css";
import { PageData } from "@/components/types";


interface Item {
    title: string;
    content: string;
    tags: string[];
}

interface ConcpetPageProps {
    pageData: PageData
    setPageData: React.Dispatch<React.SetStateAction<PageData>>;
}

function ConceptBase({ pageData, setPageData }: ConcpetPageProps) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const concept = pageData && pageData.concept;

    const handleClickOpen = (item: Item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (indexToDelete: number) => {
        // Create a shallow copy of the pageData object
        const updatedPageData: PageData = { ...pageData };

        // Check if the 'concept' property exists and update it, otherwise create an empty array
        if (updatedPageData.concept) {
            updatedPageData.concept = updatedPageData.concept.filter((_, index) => index !== indexToDelete);
        } else {
            updatedPageData.concept = [];
        }

        // Set the state with the updated object
        setPageData(updatedPageData);
    };


    return (
        <div className={styles.pages}>
            {concept ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        width: '100vw',
                        mx: 'auto',

                    }}
                >
                    <List className={styles.cubeList}>
                        {concept.map((item, index) => (
                            <ListItem
                                button
                                onClick={() => handleClickOpen(item)}
                                key={index}

                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '45vw',
                                    height: '120px',
                                    mx: '1vw',
                                    backgroundColor: '#FFC300',
                                    borderRadius: '20px',

                                    ':hover': {
                                        backgroundColor: '#333333',
                                        color: '#FFC300',
                                    },
                                }}

                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'stretch',
                                        flexGrow: 1,
                                        position: 'relative',
                                        height: '100%',
                                        width: '100%',
                                        ':hover': {
                                            backgroundColor: '#333333',
                                            color: '#FFC300',
                                        },

                                    }}
                                >
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            ':hover': {
                                                backgroundColor: '#333333',
                                                color: '#FFC300',
                                            },
                                        }}
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            handleDelete(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <ListItemText
                                        primary={item.title}
                                        primaryTypographyProps={{
                                            fontWeight: 'bold',
                                            fontSize: '20px',
                                        }}
                                        sx={{
                                            my: '12px',
                                            marginRight: '12px',
                                            height: 'auto',
                                            maxWidth: '80%',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            alignSelf: 'flex-end',
                                            mt: 'auto',

                                        }}
                                    >
                                        {item.tags.map((tag, tagIndex) => (
                                            <Chip key={tagIndex} label={tag}
                                                sx={{
                                                    width: 'auto',
                                                    height: 'auto',
                                                    ':hover': {
                                                        backgroundColor: '#333333',
                                                        color: '#FFC300',
                                                    },
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }} />
                                        ))}
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ) : (
                <p>No concepts available.</p>
            )}
            {selectedItem && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{selectedItem.title}</DialogTitle>
                    <DialogContent
                        sx={{
                            '& h1': { fontSize: '2em', margin: '0.67em 0' },
                            '& h2': { fontSize: '1.5em', margin: '0.83em 0' },
                            '& h3': { fontSize: '1.17em', margin: '1em 0' },
                            '& h4': { fontSize: '1em', margin: '1.33em 0' },
                            '& h5': { fontSize: '0.83em', margin: '1.67em 0' },
                            '& h6': { fontSize: '0.67em', margin: '2.33em 0' },
                        }}>
                        <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
                    </DialogContent>
                </Dialog>
            )}
        </div>

    );

}

export default ConceptBase;