const navi = document.querySelector('nav');
const article = document.querySelector('article');
const form = document.querySelector('.add_entry_form');
const list = document.querySelector('ul');

// show/hide all entries and the new entry form
navi.addEventListener('click', () => {
    let navi = document.querySelectorAll('.navi');
    navi[0].classList.toggle('hide');
    navi[1].classList.toggle('hide');
    article.querySelector('.all_entries').classList.toggle('hide');
    article.querySelector('.new_entry').classList.toggle('hide');
});

// add new entry template
const addComment = (entry, id) => {
    let { comment, author, created_at } = entry;
    
    const timestamp = dateFns.format(
        new Date(created_at.seconds*1000),
        'DD.MM.YYYY HH:mm');
    
    let html = `
        <li data-id=${id}>
            <div class="comment">${comment}</div>
            <div class="author">${author}</div>
            <div class="timestamp">${timestamp}</div>
        </li>
    `;
    list.innerHTML += html;
}

// get the collection from the firebase db
db.collection("gbook_entries").get().then((snapshot) => {   
    snapshot.docs.forEach(entry => {
        addComment(entry.data(), entry.id);
    });
}).catch(err => {
    alert(`We couldn't load the comments left by other guests.
    Please check if you have an internet connection and refresh the page.
    Thank you!`);
})

// add the collection to the firebase db
form.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const gbook_entry = {
        author: form.new_author.value,
        comment: form.new_comment.value,
        created_at: firebase.firestore.Timestamp.fromDate(now),
        }
    
    db.collection('gbook_entries').add(gbook_entry).then(() => {
        console.log('A new entry added');
    }).catch(err => {
        alert(`Sorry, we couldn't save your message. PLease try it again. Thank you!`);
    })
});