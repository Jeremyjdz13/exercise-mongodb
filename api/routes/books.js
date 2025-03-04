const router = require('express').Router()
const { generate: generateId } = require('shortid')
const Books = require('../models/books')
// const books = [
//   {
//     id: 'j9U3iNIQi',
//     title: 'The Colour of Magic',
//     published: 1983,
//     authors: [
//       {
//         name: 'Sir Terry Pratchett',
//         dob: '04-28-1948'
//       }
//     ]
//   },
//   {
//     id: 'ubQnXOfJV',
//     title: 'Stardust',
//     published: 1997,
//     authors: [
//       {
//         name: 'Neil Gaiman',
//         dob: '11-10-1960'
//       }
//     ]
//   }
// ];

router.get('/api/books', async (req, res, next) => {
  const status = 200
  try{
    await Books.find().then(response => {
      res.json({ status, response })
    })  
  } catch(error){
    console.log(error)
    const e = new Error('Not working!! grrrrr.')
    e.status = 400
    next(e)
  }
  
})

router.post('/api/books', async (req, res, next) => {
  const status = 201
  await Books.create(req.body).then(response =>{
    res.json({ status, response })
  })
})

router.get('/api/books/:id', async (req, res, next) => {
  const status = 200
  const response = await Books.findById(req.params.id)
  console.log(req.params.id)

  res.json({ status, response })
})

router.put('/api/books/:id', async (req, res, next) => {
  const status = 200
  const response = { id: req.params.id, ...req.body }
  const single = await Books.findById(req.params.id)
  // const index = Books.indexOf(single)

  await Books.update(single, 1, response)
  
  res.json({ status, response })
})

router.delete('/api/books/:id', async (req, res, next) => {
  const status = 200
  const response = await Books.findOneAndDelete({_id: req.params.id })
  // const index = books.indexOf(response)
    res.json({ status, response })
})

router.get('/api/books/:bookId/authors', async (req, res, next) => {
  const status = 200
  const response = await Books.findById(req.params.bookId).select('authors.name -_id')
 
  res.json({ status, response })
})

router.get('/api/books/:bookId/authors/:authorId', async (req, res, next) => {
  const status = 200
  const query = { _id: req.params.bookId }
  const id = { _id: req.params.authorId }
  const book = await Books.findById(query)
  
  console.log(id)
  console.log(book)
  const authorQuery = book.authors.find()
  
  console.log(authorQuery)
  
  // console.log(Author)
  // res.json({ status, Author })
})

router.post('/api/books/:bookId/authors', async (req, res, next) => {
  const status = 200
  const book = req.params.bookId
  const response =  await Books.findOneAndUpdate({ _id:book }).then((err, add) => {
    if(err){throw(err)}
    const Author = req.body
    console.log(Author)
  }).catch(err => console.error(err))
  
  res.json({ status, response })
})

router.put('/api/books/:bookId/authors/:authorId', async (req, res, next) => {
  const status = 200
  const book = req.params.bookId
  const author = req.params.authorId
  
  //Works first time then sometimes it doesn't work.
  await Books.findById(req.params.bookId).create({'author': req.body}).then(response => {
    res.json({ status, response })
  })
})

router.delete('/api/books/:bookId/authors/:authorId', async (req, res, next) => {
  const status = 200
  const book = await Books.findById({ _Id: req.params.bookId })

  const response = book.authors.remove({ _Id: req.params.authorId })

  res.json({ status, response })
})

module.exports = router