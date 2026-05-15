import http from 'http'

http.request('http://www.baidu.com', (res) => {
  console.log(res.statusCode)
  console.log(res.headers)
  res.on('data', (chunk) => {
    // console.log(chunk.toString())
  })
}).end()


const server = http.createServer((req, res) => {
  // res.write()
})

server.listen(5111)
