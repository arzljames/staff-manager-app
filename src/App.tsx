import InvitedUsers from "./components/invited-users";
import PendingUsers from "./components/pending-users";

function App() {
  return (
    <div className="p-4 md:p-20 lg:p-40 transition-all duration-300 w-screen h-screen">
      <InvitedUsers />
      <PendingUsers />
    </div>
  );
}

export default App;
