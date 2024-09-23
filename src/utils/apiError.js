class apiError extends Error{
    constructor(
        statusCode,
        message="somthing went wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.data=null
        this.success=false
        this.error=error
    }
}

export default apiError