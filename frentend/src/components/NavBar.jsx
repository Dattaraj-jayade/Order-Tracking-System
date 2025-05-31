

export default function NavBar({ onAddClient,
  onAddOrder,
  onAddOrderItem,
  onSearch }) {
     const handleSearchChange = (event) => {
        onSearch(event.target.value); // Call the onSearch callback with the input value
    };
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    
                    <a className="btn btn-ghost text-xl">Clients</a>
                </div>
                <div className="navbar-center ">
                    <div className="form-control">
                         <input type="text" placeholder="Search" onChange={handleSearchChange} className="input input-bordered w-48 md:w-auto" />
                    </div>
                   </div>
                  <div className="navbar-end">
                    <button onClick={onAddClient} className="btn btn-primary">ADD customer</button>

                </div> 
                <div className="navbar-end">
                    <button onClick={onAddOrder} className="btn btn-primary">ADD order</button>

                </div>
                <div className="navbar-end">
                    <button onClick={onAddOrderItem} className="btn btn-primary">ADD order_items</button>

                </div>
                
                
            </div>
        </>
    )
}