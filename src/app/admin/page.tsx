import UserTable from "./userTable"

import { auth } from "@/auth"


const Page = async () => {
    const session = await auth()
    if (!session) return <>Please log in as admin!</>
    if (session?.user?.id === "1") return (<UserTable />);
    return <>Unauthorized!</>
};
export default Page;
