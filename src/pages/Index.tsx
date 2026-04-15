import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Zap, Database, ArrowRight } from "lucide-react";

const features = [
  { icon: Shield, title: "JWT Authentication", desc: "Secure registration & login with hashed passwords and token-based auth." },
  { icon: Database, title: "Role-Based Access", desc: "User and Admin roles with Row Level Security policies." },
  { icon: Zap, title: "CRUD APIs", desc: "Full Create, Read, Update, Delete operations on tasks entity." },
  { icon: CheckCircle, title: "Input Validation", desc: "Client & server-side sanitization, Zod schemas, secure error handling." },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <nav className="container mx-auto flex items-center justify-between px-4 py-4">
      <h1 className="text-2xl font-bold gradient-text">TaskFlow API</h1>
      <div className="flex gap-2">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary">Get Started</Button></Link>
      </div>
    </nav>

    <section className="container mx-auto px-4 py-20 text-center max-w-3xl">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
        Scalable REST API with{" "}
        <span className="gradient-text">Auth & RBAC</span>
      </h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
        A production-ready task management API featuring JWT authentication, role-based access control, 
        and a clean React frontend. Built with PostgreSQL & edge functions.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/register">
          <Button size="lg" className="gradient-primary gap-2">
            Try it now <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">Sign In</Button>
        </Link>
      </div>
    </section>

    <section className="container mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="glass-card rounded-xl p-6 text-center">
            <f.icon className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      <p>TaskFlow API — Backend Developer Assignment • PostgreSQL • JWT • RBAC • React</p>
    </footer>
  </div>
);

export default Index;
