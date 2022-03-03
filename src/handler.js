/* Submission by: Aulya Yarzuki K. */
/* eslint-disable max-len */

// Import Dependencies
import { nanoid } from 'nanoid';
import books from './books.js';

// Adding a book
export const addBookHandler = (request, h) => {
	// Request body property
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	// Auto generate id and date
	const id = nanoid(18);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	// Finished value logic
	let finished;
	if (pageCount === readPage) {
		finished = true;
	} else {
		finished = false;
	}

	// Assign new book data
	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	// Response if new book doesn't have a name, the readPage > pageCount, and with completed data
	if (newBook.name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	} else if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	} else {
		// Adding new book to books array
		books.push(newBook);

		// Check if new book is successfully added
		const isSuccess = books.filter(book => book.id === id).length > 0;

		// Response if book is successfully added
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
	}

	// Response if generic error happens and status code will be 500
	const response = h.response({
		status: 'fail',
		message: 'Buku gagal ditambahkan',
	});
	response.code(500);
	return response;
};

// Geting All Books
export const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query;

	// New Array to save books data with only id, name, and publisher property
	let filteredBooks = [];
	const booksData = [];

	filteredBooks = books;

	// Filter based on query parameter
	if (reading !== undefined) {
		filteredBooks = filteredBooks.filter(book => book.reading == reading);
	} else if (finished !== undefined) {
		filteredBooks = filteredBooks.filter(book => book.finished == finished);
	} else if (name !== undefined) {
		filteredBooks = filteredBooks.filter(book =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}

	// Assign booksData
	if (filteredBooks.length != 0) {
		filteredBooks.forEach(book => {
			const bookFormat = {
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			};
			booksData.push(bookFormat);
		});
	}

	// Return booksData data
	return {
		status: 'success',
		data: {
			books: booksData,
		},
	};
};

// Get Specific Book by an id
export const getBookByIdHandler = (request, h) => {
	// Request params with book id
	const { id } = request.params;

	// Get book that match id
	const book = books.filter(book => book.id === id)[0];

	// If book with matched id is found
	if (book !== undefined) {
		const response = h.response({
			status: 'success',
			data: {
				book: book,
			},
		});
		response.code(200);
		return response;
	}

	// If book with matched id is not found
	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});
	response.code(404);
	return response;
};

// Edit book data with specific id
export const editBookByIdHandler = (request, h) => {
	// Book id to edit
	const { id } = request.params;

	// Request body property
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	// Assign update date
	const updatedAt = new Date().toISOString();

	// Finished value logic
	let finished;
	if (pageCount === readPage) {
		finished = true;
	} else {
		finished = false;
	}

	// Response if edited book doesn't have a name
	if (name === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	}

	// Response if readPage > pageCount
	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	}

	// Find book index with specified id
	const index = books.findIndex(book => book.id === id);

	// If book with specified id is found
	if (index !== -1) {
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
			updatedAt,
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});
		response.code(200);
		return response;
	}

	// If book with specified id is not found
	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};

// Deleting book with specified id
export const deleteBookByIdHandler = (request, h) => {
	// Request params with book id to delete
	const { id } = request.params;

	// Find book index with specified id
	const index = books.findIndex(book => book.id === id);

	// Delete a book
	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	}

	// If the book deletion failed
	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	response.code(404);
	return response;
};
