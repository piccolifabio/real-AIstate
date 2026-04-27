import { useParams, Navigate } from "react-router-dom";
import articoli from "./index.js";

export default function BlogRouter() {
  const { slug } = useParams();
  const Componente = articoli[slug];
  if (!Componente) return <Navigate to="/blog" replace />;
  return <Componente />;
}
