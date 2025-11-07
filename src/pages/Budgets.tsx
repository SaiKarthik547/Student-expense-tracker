import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, Edit, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  created_at: string;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Food',
      amount: 300,
      spent: 180,
      period: 'monthly',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      category: 'Textbooks',
      amount: 500,
      spent: 450,
      period: 'monthly',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      category: 'Entertainment',
      amount: 150,
      spent: 75,
      period: 'monthly',
      created_at: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly'
  });

  const categories = [
    'Food', 'Textbooks', 'Transportation', 'Entertainment', 
    'Supplies', 'Rent', 'Utilities', 'Clothing', 'Health', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (editingBudget) {
      setBudgets(prev => prev.map(budget => 
        budget.id === editingBudget.id 
          ? { ...budget, category: formData.category, amount, period: formData.period }
          : budget
      ));
      toast.success("Budget updated successfully!");
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        category: formData.category,
        amount,
        spent: 0,
        period: formData.period,
        created_at: new Date().toISOString()
      };
      setBudgets(prev => [...prev, newBudget]);
      toast.success("Budget created successfully!");
    }

    setFormData({ category: '', amount: '', period: 'monthly' });
    setEditingBudget(null);
    setIsModalOpen(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    setBudgets(prev => prev.filter(budget => budget.id !== id));
    toast.success("Budget deleted successfully!");
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-expense', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'text-warning', icon: AlertTriangle };
    return { status: 'good', color: 'text-income', icon: CheckCircle };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Budget Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Set and track your spending limits by category
            </p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
                onClick={() => {
                  setEditingBudget(null);
                  setFormData({ category: '', amount: '', period: 'monthly' });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass-card border-primary/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {editingBudget ? 'Edit' : 'Create'} Budget
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-8 glass-card border-primary/20 focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <select
                    id="period"
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-border/50 hover:border-primary/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
                  >
                    {editingBudget ? 'Update' : 'Create'} Budget
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Budget</p>
                 <p className="text-3xl font-bold text-primary">
                   ₹{totalBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </p>
              </div>
              <div className="p-3 rounded-xl bg-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Spent</p>
                 <p className="text-3xl font-bold text-expense">
                   ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </p>
              </div>
              <div className="p-3 rounded-xl bg-expense/20">
                <AlertTriangle className="w-6 h-6 text-expense" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Remaining</p>
                 <p className={`text-3xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-income' : 'text-expense'}`}>
                   ₹{Math.abs(totalBudget - totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                 </p>
              </div>
              <div className={`p-3 rounded-xl ${totalBudget - totalSpent >= 0 ? 'bg-income/20' : 'bg-expense/20'}`}>
                <CheckCircle className={`w-6 h-6 ${totalBudget - totalSpent >= 0 ? 'text-income' : 'text-expense'}`} />
              </div>
            </div>
          </Card>
        </div>

        {/* Budget List */}
        {budgets.length === 0 ? (
          <Card className="glass-card p-12 text-center animate-fade-in">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Budgets Set</h3>
            <p className="text-muted-foreground mb-6">Create your first budget to start tracking your spending</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget, index) => {
              const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
              const budgetStatus = getBudgetStatus(budget);
              const StatusIcon = budgetStatus.icon;

              return (
                <Card 
                  key={budget.id}
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{budget.category}</h3>
                        <p className="text-muted-foreground capitalize">{budget.period} budget</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`w-5 h-5 ${budgetStatus.color}`} />
                        <Badge 
                          variant={budgetStatus.status === 'exceeded' ? 'destructive' : 'secondary'}
                          className="px-3 py-1"
                        >
                          {percentage.toFixed(0)}% used
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(budget)}
                          className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(budget.id)}
                          className="border-expense/20 hover:border-expense/50 hover:bg-expense/10 text-expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">
                         ₹{budget.spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} spent
                       </span>
                       <span className="font-medium">
                         ₹{budget.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} budget
                       </span>
                    </div>
                    
                    <div className="relative">
                      <Progress value={percentage} className="h-3 bg-muted/50" />
                      <div 
                        className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out ${
                          percentage >= 100 ? 'bg-expense' : 
                          percentage >= 80 ? 'bg-warning' : 
                          'bg-gradient-to-r from-primary to-accent'
                        }`}
                        style={{ 
                          width: `${percentage}%`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                       <span className={budgetStatus.color}>
                         ₹{(budget.amount - budget.spent).toLocaleString('en-IN', { minimumFractionDigits: 2 })} remaining
                       </span>
                       {percentage >= 100 && (
                         <span className="text-expense font-medium">
                           ₹{(budget.spent - budget.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} over budget
                         </span>
                       )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}