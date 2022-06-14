const { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookHandler, deleteBookByIdHandler } = require("./handler");

const routes = [{
    method : 'POST',
    path : '/books',
    handler : addBooksHandler,
},
{
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
},
{
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler
},
{
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookHandler
},
{
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler
}
];

module.exports = routes;
