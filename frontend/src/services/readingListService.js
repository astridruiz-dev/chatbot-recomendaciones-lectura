const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(accessToken) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  };
}

function normalizeReadingListItem(item) {
  return {
    id: item.book_id,
    savedItemId: item.id,
    userEmail: item.user_email,

    title: item.title,
    author: item.author,
    language: item.language,
    pages: item.pages,
    length: item.length,

    available: item.available,
    sublocation: item.sublocation,
    collection: item.sublocation,
    callNumber: item.call_number,
    call_number: item.call_number,
    isbn: item.isbn,

    summary: item.summary,
    coverEmoji: item.cover_emoji,
    cover_emoji: item.cover_emoji,
    coverUrl: item.cover_url,
    cover_url: item.cover_url,
    destinyUrl: item.destiny_url,
    destiny_url: item.destiny_url,

    addedAt: item.added_at
  };
}

export async function getReadingList(accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/reading-list/`,
    {
      headers: getAuthHeaders(accessToken)
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar la lista de lectura");
  }

  const data = await response.json();

  return data.map(normalizeReadingListItem);
}

export async function addBookToReadingList(accessToken, book) {
  const payload = {
    book_id: String(book.id),
    title: book.title,
    author: book.author || null,
    language: book.language || null,
    pages: book.pages || null,
    length: book.length || null,
    available: book.available ?? true,
    sublocation: book.sublocation || book.collection || null,
    call_number: book.callNumber || book.call_number || null,
    isbn: book.isbn || null,
    summary: book.summary || book.overview || null,
    cover_emoji: book.coverEmoji || book.cover_emoji || null,
    cover_url: book.coverUrl || book.cover_url || null,
    destiny_url: book.destinyUrl || book.destiny_url || null
  };

  const response = await fetch(`${API_BASE_URL}/reading-list/`, {
    method: "POST",
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("No se pudo agregar el libro a la lista de lectura");
  }

  const data = await response.json();

  return normalizeReadingListItem(data);
}

export async function removeBookFromReadingList(accessToken, bookId) {
  const response = await fetch(
    `${API_BASE_URL}/reading-list/${encodeURIComponent(bookId)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(accessToken)
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar el libro de la lista de lectura");
  }

  return await response.json();
}