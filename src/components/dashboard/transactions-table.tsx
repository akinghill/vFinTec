"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Search, MoreHorizontal, Edit, Trash, ArrowDown, ArrowUp } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createTransaction, updateTransaction, deleteTransaction } from "@/server/actions/transactions";

type Transaction = {
    id: string;
    amount: number;
    description: string;
    category: string;
    createdAt: Date;
    createdBy: {
        name: string | null;
        email: string | null;
    };
};

export function TransactionsTable({ initialData }: { initialData: Transaction[] }) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialData);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formAmount, setFormAmount] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formCategory, setFormCategory] = useState("");

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateDialog = () => {
        setEditingTx(null);
        setFormAmount("");
        setFormDescription("");
        setFormCategory("");
        setIsDialogOpen(true);
    };

    const openEditDialog = (t: Transaction) => {
        setEditingTx(t);
        setFormAmount(t.amount.toString());
        setFormDescription(t.description);
        setFormCategory(t.category);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const numAmount = parseFloat(formAmount);
            if (isNaN(numAmount)) return;

            let updatedList;
            if (editingTx) {
                updatedList = await updateTransaction(editingTx.id, {
                    amount: numAmount,
                    description: formDescription,
                    category: formCategory,
                });
            } else {
                updatedList = await createTransaction({
                    amount: numAmount,
                    description: formDescription,
                    category: formCategory,
                });
            }
            setTransactions(updatedList as Transaction[]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save transaction", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction?")) return;
        try {
            const updatedList = await deleteTransaction(id);
            setTransactions(updatedList as Transaction[]);
        } catch (error) {
            console.error("Failed to delete transaction", error);
        }
    };

    return (
        <Card className="col-span-full shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-4">
                <div>
                    <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
                    <CardDescription>Manage and view your organization&apos;s transactions</CardDescription>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter transactions..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <TableRow key={tx.id} className="group">
                                        <TableCell className="font-medium">
                                            {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                                        </TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ring-muted-foreground/20 bg-muted/10">
                                                {tx.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {tx.createdBy?.name || tx.createdBy?.email || "Unknown"}
                                        </TableCell>
                                        <TableCell className={`text-right font-medium ${tx.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {tx.amount >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(tx.amount))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(tx)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => handleDelete(tx.id)}
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTx ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
                        <DialogDescription>
                            Enter the details of the transaction below. Use negative numbers for expenses.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="-500.00 or 1500.00"
                                value={formAmount}
                                onChange={(e) => setFormAmount(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="E.g., AWS Hosting or Monthly Subscription"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="E.g., Infrastructure, Payroll, Revenue"
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
