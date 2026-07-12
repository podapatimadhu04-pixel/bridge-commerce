import { auth, defineMcp } from "@lovable.dev/mcp-js";
import browseProducts from "./tools/browse-products";
import listMyOrders from "./tools/list-my-orders";
import listMyAddresses from "./tools/list-my-addresses";
import getMyProfile from "./tools/get-my-profile";
import placeOrder from "./tools/place-order";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "orbitmarket-mcp",
  title: "OrbitMarket",
  version: "0.1.0",
  instructions:
    "Tools for OrbitMarket, a global marketplace for restaurants, groceries, and wholesale electronics. Use browse_products to search the public catalog. Use list_my_orders, list_my_addresses, and get_my_profile to read the signed-in user's data.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [browseProducts, listMyOrders, listMyAddresses, getMyProfile, placeOrder],
});
