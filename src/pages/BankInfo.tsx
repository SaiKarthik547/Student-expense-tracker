import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Plus, Edit, Trash2, Landmark, Shield, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

interface BankAccount extends Tables<'bank_accounts'> {}

export default function BankInfo() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_type: 'savings',
    account_number: '',
    balance: '',
    currency: 'INR',
    is_primary: false
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error: unknown) {
      toast.error("Error fetching bank accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const accountData = {
        user_id: user.id,
        bank_name: formData.bank_name,
        account_type: formData.account_type,
        account_number: formData.account_number,
        balance: parseFloat(formData.balance) || 0,
        currency: formData.currency,
        is_primary: formData.is_primary
      };

      if (editingAccount) {
        const { error } = await supabase
          .from('bank_accounts')
          .update(accountData)
          .eq('id', editingAccount.id);

        if (error) throw error;
        toast.success("Bank account updated successfully!");
      } else {
        const { error } = await supabase
          .from('bank_accounts')
          .insert([accountData]);

        if (error) throw error;
        toast.success("Bank account added successfully!");
      }

      setFormData({
        bank_name: '',
        account_type: 'savings',
        account_number: '',
        balance: '',
        currency: 'INR',
        is_primary: false
      });
      setEditingAccount(null);
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error: unknown) {
      toast.error("Error saving bank account");
    }
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_type: account.account_type,
      account_number: account.account_number,
      balance: account.balance.toString(),
      currency: account.currency,
      is_primary: account.is_primary || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Bank account deleted successfully!");
      fetchAccounts();
    } catch (error: unknown) {
      toast.error("Error deleting bank account");
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (loading) {
    return (
      <div className="p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bank Accounts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Indian bank accounts and digital wallets
            </p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
                onClick={() => {
                  setEditingAccount(null);
                  setFormData({
                    bank_name: '',
                    account_type: 'savings',
                    account_number: '',
                    balance: '',
                    currency: 'INR',
                    is_primary: false
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass-card border-primary/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {editingAccount ? 'Edit' : 'Add'} Bank Account
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <select
                    id="bank_name"
                    value={formData.bank_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="Union Bank of India">Union Bank of India</option>
                    <option value="Indian Bank">Indian Bank</option>
                    <option value="Central Bank of India">Central Bank of India</option>
                    <option value="Bank of India">Bank of India</option>
                    <option value="YES Bank">YES Bank</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                    <option value="Federal Bank">Federal Bank</option>
                    <option value="South Indian Bank">South Indian Bank</option>
                    <option value="Karnataka Bank">Karnataka Bank</option>
                    <option value="Paytm Payments Bank">Paytm Payments Bank</option>
                    <option value="Airtel Payments Bank">Airtel Payments Bank</option>
                    <option value="Jio Payments Bank">Jio Payments Bank</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_type">Account Type</Label>
                  <select
                    id="account_type"
                    value={formData.account_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                    required
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="student">Student Account</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    placeholder="Last 4 digits for security"
                    value={formData.account_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                    className="glass-card border-primary/20 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.balance}
                      onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
                      className="glass-card border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <input
                      type="text"
                      value="INR (₹)"
                      readOnly
                      className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 bg-muted text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="rounded border-primary/20"
                  />
                  <Label htmlFor="is_primary">Set as primary account</Label>
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
                    {editingAccount ? 'Update' : 'Add'} Account
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Total Balance Summary */}
        <Card className="glass-card p-6 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Balance</p>
                <p className="text-4xl font-bold text-primary">
                  ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </Card>

        {/* Bank Accounts Grid */}
        {accounts.length === 0 ? (
          <Card className="glass-card p-12 text-center animate-fade-in">
            <Landmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Bank Accounts</h3>
            <p className="text-muted-foreground mb-6">Add your first bank account to get started</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <Card 
                key={account.id} 
                className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50" />
                
                {/* Primary Badge */}
                {account.is_primary && (
                  <Badge className="absolute top-4 right-4 bg-primary/20 text-primary border-primary/30">
                    Primary
                  </Badge>
                )}

                <div className="relative z-10 space-y-4">
                  {/* Bank Info */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{account.bank_name}</h3>
                      <p className="text-muted-foreground text-sm capitalize">
                        {account.account_type} Account
                      </p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        ••••{maskAccountNumber(account.account_number)}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-2xl font-bold text-primary">
                        ₹{account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(account)}
                      className="flex-1 border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      className="border-expense/20 hover:border-expense/50 hover:bg-expense/10 text-expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}