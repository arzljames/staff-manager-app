import { Plus } from "lucide-react";
import { Button } from "./components/ui/button";
import Layout from "./layout";

function App() {
  return (
    <Layout>
      <div className="p-2 transition-all duration-300 w-svw">
        <div className="w-full bg-purple-50 flex flex-row justify-end">
          <Button>
            <Plus />
            Invite
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
