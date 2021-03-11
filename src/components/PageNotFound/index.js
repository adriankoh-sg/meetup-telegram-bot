function PageNotFound () {
    return (
        <div className="card text-center bg-warning">
            <div className="card-header">
                System Message
            </div>
            <div className="card-body">
                <h5 className="card-title">Warning:</h5>
                <p className="card-text">Ops... Some Error found.</p>
                <a href="/" className="btn btn-primary">Homepage</a>
            </div>
        </div>
    )
}

export default PageNotFound;

