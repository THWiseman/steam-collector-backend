
const helloWorldController = (app) => {
    app.get('/helloworld', (req, res) => {
        res.send('Hello World')
    });
}
export default helloWorldController;