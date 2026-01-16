'use client';

import React from 'react';
import { useUser } from '@/firebase/provider';
import { ADMIN_EMAILS } from '@/lib/admins';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert, Home, Lock, Users as AdminUsers, HelpCircle, MessageSquare, BookOpen, BrainCircuit, FileText, Database, ChevronsUpDown, Settings, Bell, FlaskConical, Shield, MessageCircle, Server, User, SlidersHorizontal, LogOut, FileUp, PlusCircle, Search, BarChart2, Users } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

const adminSections = [
    { name: 'Dashboard', icon: Home, section: 'dashboard' },
    { name: 'Authentication', icon: Lock, section: 'auth' },
    { name: 'Admin Management', icon: AdminUsers, section: 'admin' },
    { name: 'User Management', icon: Users, section: 'users' },
    { name: 'Question Management', icon: HelpCircle, section: 'questions' },
    { name: 'Answer Management', icon: MessageSquare, section: 'answers' },
    { name: 'Category Management', icon: BookOpen, section: 'categories' },
    { name: 'AI & Matching', icon: BrainCircuit, section: 'ai' },
    { name: 'Logs & Tracking', icon: FileText, section: 'logs' },
    { name: 'API & Integrations', icon: Database, section: 'api' },
    { name: 'Data Import/Export', icon: ChevronsUpDown, section: 'data' },
    { name: 'App Configuration', icon: Settings, section: 'config' },
    { name: 'Notifications', icon: Bell, section: 'notifications' },
    { name: 'Testing & Debug', icon: FlaskConical, section: 'testing' },
    { name: 'Security & Compliance', icon: Shield, section: 'security' },
    { name: 'Support & Feedback', icon: MessageCircle, section: 'support' },
    { name: 'System Controls', icon: Server, section: 'system' },
];

const mockUsers = [
  { name: "Ankit Sharma", email: "ankit.sharma@example.com", status: "Active", lastLogin: "2h ago", device: "Mobile" },
  { name: "Priya Singh", email: "priya.singh@example.com", status: "Active", lastLogin: "1d ago", device: "Web" },
  { name: "Rahul Kumar", email: "rahul.kumar@example.com", status: "Blocked", lastLogin: "5d ago", device: "Mobile" },
  { name: "Sneha Patel", email: "sneha.patel@example.com", status: "Inactive", lastLogin: "1m ago", device: "Web" },
];

const mockQuestions = [
    { text: "What is the difference between WPS and PQR?", category: "Welding", difficulty: "Medium", views: 1204 },
    { text: "Explain the principle of Dye Penetrant Testing.", category: "NDT", difficulty: "Easy", views: 987 },
    { text: "What are the acceptance criteria for undercut as per AWS D1.1?", category: "Piping", difficulty: "Hard", views: 753 },
];

const mockLogs = [
    { admin: "Super Admin", action: "Deleted question #1024", timestamp: "2024-05-21 10:30 AM" },
    { admin: "Content Admin", action: "Approved content for 'UT Technique'", timestamp: "2024-05-21 09:15 AM" },
    { admin: "Super Admin", action: "Blocked user 'rahul.kumar@example.com'", timestamp: "2024-05-20 03:45 PM" },
];


function AdminPanel() {
    return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar collapsible="icon" className="group-data-[variant=floating]:border-r-0">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminSections.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton href={`#${item.section}`} tooltip={item.name}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2" />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start w-full group-data-[collapsible=icon]:w-auto p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>SA</AvatarFallback>
                        </Avatar>
                        <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                            <p className="font-semibold text-sm">Super Admin</p>
                            <p className="text-xs text-muted-foreground">admin@xtudyai.com</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="max-w-full overflow-x-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-white px-6">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-semibold">Admin Panel</h1>
          </header>

          <main className="flex-1 p-6 space-y-8">
            
            {/* Dashboard & Analytics */}
            <section id="dashboard">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard & Analytics</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,254</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5,820</div>
                    <p className="text-xs text-muted-foreground">+180 since last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Match Success</CardTitle>
                    <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">92.8%</div>
                    <p className="text-xs text-muted-foreground">+1.2% from yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">482</div>
                    <p className="text-xs text-muted-foreground">Highest this week</p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* User Management */}
            <section id="users">
              <h2 className="text-2xl font-bold tracking-tight mb-4">User Management</h2>
              <Card>
                <CardHeader>
                  <CardTitle>App Users</CardTitle>
                  <CardDescription>Manage your application users.</CardDescription>
                  <div className="relative pt-2">
                    <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users by name or email..." className="pl-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map(user => (
                        <TableRow key={user.email}>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-500/20 text-green-700' : user.status === 'Blocked' ? 'bg-red-500/20 text-red-700' : 'bg-slate-500/20 text-slate-700'}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>View Activity</DropdownMenuItem>
                                    <DropdownMenuItem>{user.status === 'Blocked' ? 'Unblock' : 'Block'} User</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500">Delete User</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

             {/* Question Management */}
            <section id="questions">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Question Management</h2>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Content Database</CardTitle>
                                <CardDescription>Add, edit, and manage all questions and their variations.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline"><FileUp className="mr-2" /> Bulk Upload</Button>
                                <Button><PlusCircle className="mr-2" /> Add New Question</Button>
                            </div>
                        </div>
                         <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-4 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search questions..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockQuestions.map((q, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium max-w-md truncate">{q.text}</TableCell>
                                    <TableCell><Badge variant="secondary">{q.category}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            q.difficulty === 'Easy' ? 'border-green-500/50 bg-green-500/10 text-green-700' :
                                            q.difficulty === 'Medium' ? 'border-amber-500/50 bg-amber-500/10 text-amber-700' :
                                            'border-red-500/50 bg-red-500/10 text-red-700'
                                        }>{q.difficulty}</Badge>
                                    </TableCell>
                                    <TableCell>{q.views}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">Delete</Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>


             {/* AI Settings */}
            <section id="ai">
              <h2 className="text-2xl font-bold tracking-tight mb-4">AI & Matching Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>AI Behavior Control</CardTitle>
                  <CardDescription>Adjust the core parameters of the matching and AI response engine.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="confidence-threshold">
                      <span className="font-medium">Confidence Threshold</span>
                      <p className="text-xs text-muted-foreground">Minimum score to consider a DB match (%).</p>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input id="confidence-threshold" type="number" defaultValue="75" className="w-20" />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="offline-ai">
                      <span className="font-medium">Offline AI Mode</span>
                      <p className="text-xs text-muted-foreground">Enable or disable AI fallback when offline.</p>
                    </Label>
                    <Switch id="offline-ai" />
                  </div>
                   <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="language-detection">
                      <span className="font-medium">Language Detection</span>
                       <p className="text-xs text-muted-foreground">Automatically detect user language (EN/HI).</p>
                    </Label>
                    <Switch id="language-detection" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </section>


            {/* Logs & Activity */}
            <section id="logs">
                 <h2 className="text-2xl font-bold tracking-tight mb-4">Logs & Activity Tracking</h2>
                <Card>
                    <CardHeader>
                         <CardTitle>Admin Activity Log</CardTitle>
                         <CardDescription>Track all major actions performed by administrators.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockLogs.map((log, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Badge variant={log.admin === 'Super Admin' ? 'default' : 'secondary'}>{log.admin}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{log.action}</TableCell>
                                        <TableCell>{log.timestamp}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>

             {/* System Controls */}
            <section id="system">
                <h2 className="text-2xl font-bold tracking-tight mb-4">System Controls</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>System Health & Maintenance</CardTitle>
                        <CardDescription>Perform system-level actions. Use with caution.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline">Restart Services</Button>
                        <Button variant="outline">Clear Cache</Button>
                        <Button variant="destructive">Clear All Logs</Button>
                    </CardContent>
                </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    );
}

export default function AdminPanelPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Verifying Access...</h2>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  const isAdmin = user && user.email && ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return (
       <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-slate-50">
          <ShieldAlert className="w-24 h-24 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold font-headline text-slate-800">Access Denied</h1>
          <p className="mt-2 text-lg text-slate-600 max-w-md">
            You do not have permission to view this page. Please contact an administrator if you believe this is an error.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Go back to Home</Link>
          </Button>
        </div>
    );
  }

  // If user is an admin, show the panel
  return <AdminPanel />;
}
