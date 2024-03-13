import React, { useEffect, useState } from "react";

//import the components we want for the frontend.
import { Flex, hubspot, LoadingSpinner, TableBody, TableCell, TableHead, TableRow, TableHeader, Table, Heading} from "@hubspot/ui-extensions";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    fetchProperties={actions.fetchCrmObjectProperties}
  />
));

// Define the Extension component, taking in runServerless, context, & fetchProperties as props
const Extension = ({ context, runServerless, fetchProperties }) => {
  
  // create our constants to hold data. use State allows you to track the state of teh const within a function component.

  // This will hold our "Books" data from the GraphQL query in fetchAssociatedBooks.js.
  const [books, setBooks] = useState(null);

  // Hold the "hs_object_id" of the current contact being viewed. This is then used as a parameter in our GraphQL query to get the correct contacts associations.
  const [currentObjectId, setCurrentObjectId] = useState(null);

  // Boolean for the loading state of the content
  const [loading, setLoading] = useState(true);


  //useEffect
  useEffect(()=> {
    //fecth the hs_object_id of the contact
    fetchProperties(["hs_object_id"]).then((properties) => {
      // set the currentObjectId const == to the hs_object_id.
      setCurrentObjectId(properties.hs_object_id);
    });
    runServerless({ name: "fetchAssociatedBooks", parameters: {hs_object_id: currentObjectId}}).then((resp) => {
      console.log(resp);
      if (resp.status === "SUCCESS") {
        setBooks(resp.response.data.CRM.contact.associations.p_books_collection__books_to_contact.items);
        // Set the loading state to false, which removes the LoadingSpinner component
        setLoading(false);
      }
    });
    // When currentObjectId changes, the effect will run again. 
  }, [currentObjectId]);

  /*
   * Screens
   */

  return (
    <>
    {/**
     * If our const that signifies the loading state is true, show a loading indicator. This helps prevent the user from seeing a partially loaded component while data loads.
     */}
    {loading && <LoadingSpinner label='Data is loading' showLabel={true} size='md' layout="centered"></LoadingSpinner>}

    {/**
     * Show the table if the "books" const contains data
     */} 
     {books && (
      <>
      <Flex direction={'column'} wrap={'wrap'} gap={'small'}>
        <Heading>Favorite Books</Heading>
        <Table bordered={true} width='auto'>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableHeader>Book Title</TableHeader>
              <TableHeader>Author</TableHeader>
              <TableHeader>Publisher</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Table Body - Map the books array data */}
            {books.map((book) => (
              <TableRow>
                <TableCell>{book.book_title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Flex>
      </>
     )}
    </>
  );
};
