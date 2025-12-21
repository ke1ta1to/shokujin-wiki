import { AuthSample } from "@/components/auth-sample";
import { RpcSample } from "@/components/rpc-sample";

export default async function IndexPage() {
  return (
    <div className="prose">
      <h1 className="text-3xl font-bold underline">Shokujin Wikiへようこそ</h1>
      <AuthSample />
      <RpcSample />
    </div>
  );
}
