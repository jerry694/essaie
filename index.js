const express =  require("express")
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/assets/medias', express.static('./assets/medias'));





app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const port = 3000
const ChansonsRouter =  require("./routes/chansonsRouts")


var corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200
  };


app.use(cors(corsOptions));
app.use(express.json())
app.use(
    express.urlencoded({
        extended:true
    })
)

app.get("/",(req,res) => {
    res.json({message: "ok"})
})

app.use("/chansons",ChansonsRouter)

app.use((err,rea,res,next) =>{
    const statusCode = err.statusCode || 500
    console.error(err.message,err.stack)
    res.status(statusCode).json({message : err.message})
    return
})

app.listen(port, () => {
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log("jeeeeeeeeeee")
    console.log(`Chansons app listening at http://localhost:${port}`)

})