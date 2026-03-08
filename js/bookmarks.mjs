export async function toggleBookmark(user_id, id) {
  const res = await fetch(`http://localhost:3060/bookmarks?user_id=${user_id}&id=${id}`);
  const existing = await res.json();

  if (existing.length > 0) {
    await fetch(`http://localhost:3060/bookmarks/${existing[0].id}`, { method: 'DELETE' });
  } else {
    await fetch('http://localhost:3060/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, id })
    });
  }
}

async function getBookmarksData() {
    const bookmarks = await fetch('http://localhost:3060/bookmarks')
    bookmarks.json()
        .then((data) => {
            console.log(data);
        })
}
getBookmarksData();

