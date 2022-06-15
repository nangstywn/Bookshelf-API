const {nanoid} = require('nanoid');
const books = require('./books');
//Menambahkan buku
const addBooksHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    //cek apakah nama buku diisi atau tidak
    if(!name) {//nama kosong
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    //cek apakah readPage lebih besar dari pageCount
    if(readPage > pageCount) {
        const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    //membuat object buku
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }
    //memasukkan buku ke dalam array books
    books.push(newBook);
    //cek apakah sukses disimpan
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
        });
    response.code(201);
    return response;
    }
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
}
//Mengambil semua buku
const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;
    let filteredBooks = books;
    if(name){
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if(reading){
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
    }
    if(finished){
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
    }

    const response = h.response({
    status: 'success',
    data: {
        books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
        }))
    },
});
    response.code(200);
    return response;
}
//Mengambil buku berdasarkan id
const getBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const book = books.find((book) => book.id === id);
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            }
        });
        response.code(200);
        return response;
    }else{
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });
        response.code(404);
        return response;
    }
}
//Mengubah data buku
const editBookHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
        if(!name){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
        if(readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
        //update data buku
        const finished = pageCount === readPage;
        if(index !== -1){
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                updatedAt
            }
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            });
            response.code(200);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal memparbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
//menghapus buku
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}


module.exports = {addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookHandler, deleteBookByIdHandler};