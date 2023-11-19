const express = require('express');//express묘듈을 가져옴
const knex = require('knex');//knex모듈을 가져옴
const app = express();//app 변수에  express값을 저장

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// json parse 대충 미들웨어 등록?

//데이터베이스에 연결
const db = knex({//데이터베이스 정보입력
  client: 'mysql',//쓰는 데이터베이스 표시
  connection: {//connection설정
    host: '127.0.0.1',// 서버 주소
    port: 3306,//port번호
    user: 'root',//유저 이름
    password: 'root',//페스워드 
    database: 'test'// 데이터베이스 스키마 이름
  }
});

const port = 3001;//port 변수에 3000값 저장 

app.get('/', (req, res) => {//루츠로 get 요청이오면 
  res.send('status');//웹페이지에 status를 띄워줌 
})


app.post('/register', async (req, res) => {///register로 post 요청이 오면 실행
  try {// try catch는 에러를 잡을때 씀 에러가 뜨면 catch로 이동 
		await db.insert({ id: req.body.id, password: req.body.password }).into('test')// insert메서드를 호출,새로운 db레코드 삽입한다 삽입할 데이터는 req.body.id와 req.body.password에서 가져온다,데이터는 test테이블에 삽입됌
		res.send({ success: true, message: '' })//성공적으로 보냈을때 
  } 
  catch(err) { // id가 중복이면 에러를 처리하기 때문에 (unique라서) catch 쓰고 success: false 보냄
    res.send({ success: false, message: err })
  } 
})

app.post('/login', async (req, res) => { // /login으로 post 요청이 오면 실행
  try { //에러 잡는 try catch
    const [user] = await db.select('*').from('test').where({ id: req.body.id })//db객체의 select메소드를 호출해서 test테이블에서 id가 req.body와 일치하는 레코드를 선택하고 user변수에 할당됌 

		if (user && user.password === req.body.password) {//user의 password가 req.body.password와 일치하는지 확인하는 코드
			res.send({ success: true, message: '' })//성공했으면 ture로 하고 나오는 메시지는 없다 
		} 
    else {// user의 password가 req.body.password와 일치하지 않을때
			res.send({ success: false, message: 'password 틀림' })// false로 설정하고 패스워드 틀림 이라는 메시지를 보냄 
    }
  } 
  catch(err) {// 에러발생했을때 
    res.send({ success: false, message: err });// success속성을 false로 설정하고 에러메시지를 보냄 
  }
})

app.post('/getUsers', async (req, res) => {// /getusers로 post 요청이 들어오면 심행
  try { // 에러를 잡는 코드 에러가 생기면 catch문으로 이동
    const selects = await db.select('*').from('test').limit(req.body.idx)//데이터베이스에서 test테이블에서 모든데이터를 선택, 선택한 데이터를 selects변수에 할당하면 선택한 데이터 개수는 req.body.idx에 지정된 값으로 데한
    res.send({ success: true, body: selects })//선택한 데이터를 성공적으로 보냈을때 ture속성으로 지정, 선택한 데이터가 body속성에 포함 
  } 
  catch(err) {// 에러가 발생했을때 실행
    res.send({ success: false, message: err })// success속성이 false이고 에러 메시지를 보냄
  }
})

app.listen(port, () => { //서버를 시작하며, 위 GET, POST로 요청이 오면 받겠다는 뜻.
  console.log(`Start Server http://localhost:${port}`); //서버가 정상적으로 시작되면 터미널에 띄워주는 메시지 
})


// const express = require('express')//express묘듈을 가져옴
// const knex = require('knex')//knex모듈을 가져옴
// const app = express()//app 변수에  express값을 저장
// const port = 3000;//port 변수에 3000값 저장 

// app.use(express.json())//
// app.use(express.urlencoded({extended: true}))//

// const db = knex({//데이터베이스 정보입력
//   client: 'mysql',//쓰는 데이터베이스 표시
//   connection: {//connection설정
//     host:  '127.0.0.1',//host번호  // 서버 주소
//     port: 3306,//port번호
//     user: 'root',//유저 이름
//     password: 'root',//페스워드 
//     database: 'test'// 데이터베이스 스키마 이름
//   }
// })

// app.get('/',(req,res) => {//루드로 요청이 오면 
//   res.send('hello world!')//hello world띄워줌
// })

// app.post('/insert', async (req,res) => {//insert로 post 요청이오면 
//   try {//db에 저장된 값이 맞으면 정상작동  // 에러를 잡기 위해서 쓰는 try catch  
//     await db.insert({name: req.body.name}).into('test') //name은 body로 받은 name을 test라는 테이블에 값으로 저장 
//     res.send({ success: true, message: ''})//true 나오는 메시지는 없음
//   }
//   catch(err) {//에러가 떴을 경우 에러표시
//     res.send({ success: false, message: err})//false err메시지를 띄움 
//   }
// })

// app.post('/getDeta', async (req,res) => {//getDeta로 post요청이오면 
//   try {//맞으면 정상작동   // 에러를 잡기 위해서 쓰는 try catch
//     const selects = await db.select('*').from('test').limit(req.body.idx)// test 테이블에서 값을 가져옴. body로 idx를 받아와서 몇개를 가져올지 명령.
//     res.send({ success: true, body: selects}) //true body는 selects라는 데이터베이스에서 가져온 값을 보내줌.
//   }
//   catch(err) {//틀리면 에러 메시지 표시
//     res.send({ success: false, message: err})//false 에러문구 띄움 
//   }
// })

// app.listen(port,() => {//port에 저장된 값으로 서버를 시작하겠다는 코드 // 정확히는.. 서버를 시작하며, 위 GET, POST 으로 요청이 오면 받겠다는 뜻.
//   console.log(`Start Server http://localhost:${port}`)//서버가 시작되면 터미널에 뛰워주는 메시지 
// })