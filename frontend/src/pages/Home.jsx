import Header from "./Header";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-body" >
            <Header />
            <div className="flex flex-col items-center h-screen bg-no-repeat bg-cover bg-[url('')]">
                <div className="home-div">
                    <h1 className="text-black text-center text-3xl lg:text-5xl max-sm:text-xl">WELCOME TO OUR WEBSITE</h1>
                </div>
            </div>
        </div>
    );
}

export default Home