import { browse } from "./app.js";
export const BASE_URL = 'https://learn.zone01oujda.ma';

export async function graphqlRequest(query, variables = {}) {
  const jwt = localStorage.getItem("jwt");
  const res = await fetch(`${BASE_URL}/api/graphql-engine/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export async function Signin(identifier, password) {
  const res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(identifier + ":" + password)}`
    }
  });
  const responseText = await res.text();
  
  if (!res.ok) throw new Error("Invalid credentials");
  
  const token = JSON.parse(responseText);
  localStorage.setItem("jwt", token);
}

export function Signout() {
  localStorage.removeItem("jwt");
  browse('/signin');
} 