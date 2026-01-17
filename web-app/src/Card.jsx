

function Card({children}) {
    return(
       <div className="card">
            {/* <h2 className="card-title">Welcome to Fuelnomic</h2>
            <p className="card-text">ADMIN DASHBOARD</p> */}
            {children}
       </div> 
    );
}
export default Card