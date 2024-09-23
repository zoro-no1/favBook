class ApiSuccess {
    constructor(
    statusCode,
    data,
    message="successfully"
    ) {
        this.statusCode=statusCode
        this.message=message
        this.data=data
        
    }
}
export default ApiSuccess