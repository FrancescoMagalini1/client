import useUserStore from "../stores/userStore";
import "../assets/styles/home.css";

function Home() {
  let name = useUserStore((state) => state.name);

  return (
    <div id="home">
      <div>
        <h3>Hi {name}</h3>
      </div>
    </div>
  );
}

export default Home;
