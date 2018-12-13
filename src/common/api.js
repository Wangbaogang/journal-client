import { message } from 'antd'
const _postData = (url, data = {}) => {
  return fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        return response.json()
      }
      if (response.status === 404) {
        message.error('404错误')
      } else {
        message.error('未知错误')
      }
      return Promise.reject(response)
    })
    .then(res => {
      if (res.success) {
        return res
      } else {
        message.info(res.message)
        return Promise.reject(res)
      }
    })
}

async function register({ userName, password, email }) {
  let response = await _postData('/api/public/register', {
    userName,
    password,
    email
  })
  return response
}

async function sendActiveMail({ email }) {
  let response = await _postData('/api/public/sendActiveMail', {
    email
  })
  return response
}

async function login({ email, password }) {
  let response = await _postData('/api/public/login', {
    email,
    password
  })
  return response
}

async function logout() {
  let response = await _postData('/api/logout', {})
  return response
}

async function findJournals() {
  let response = await _postData('/api/findJournals', {})
  return response
}

async function findJournalById(id) {
  let response = await _postData('/api/findJournalById', { id })
  return response
}

async function createJournal({ title, content }) {
  let response = await _postData('/api/createJournal', {
    title,
    content
  })
  return response
}

async function updateJournal({ title, content, id }) {
  let response = await _postData('/api/updateJournal', {
    title,
    content,
    id
  })
  return response
}

export default {
  register,
  login,
  logout,
  sendActiveMail,
  findJournals,
  findJournalById,
  createJournal,
  updateJournal
}
