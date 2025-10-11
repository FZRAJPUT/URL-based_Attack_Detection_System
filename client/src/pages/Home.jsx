import Dashboard from "../components/Dashboard";
import URLCheck from "../components/URLCheck";

const Home = () => {
  return (
    <div className="space-y-12">
      <URLCheck />
      <Dashboard />
    </div>
  );
};

export default Home;
