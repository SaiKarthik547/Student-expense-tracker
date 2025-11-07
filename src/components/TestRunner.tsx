import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Shield,
  Zap,
  Code,
  GitBranch 
} from 'lucide-react';
import { TestRunner, TestResult, TestSuite } from '@/lib/testing';
import { ExportService } from '@/lib/export';
import { toast } from 'sonner';

export default function TestRunnerComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const testRunner = new TestRunner();

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestSuite(null);
    setCurrentTest('Initializing test suite...');

    try {
      // Run tests with progress updates
      const suite = await testRunner.runAllTests();
      setTestSuite(suite);
      setProgress(100);
      setCurrentTest('Tests completed');
      
      toast.success(`Tests completed: ${suite.passedTests}/${suite.totalTests} passed`);
    } catch (error: any) {
      toast.error('Test execution failed: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const exportTestResults = () => {
    if (!testSuite) return;

    const csvData = ExportService.exportTestResults(testSuite.tests, true);
    const timestamp = new Date().toISOString().split('T')[0];
    ExportService.downloadFile(csvData, `test-results-${timestamp}.csv`);
    
    toast.success('Test results exported successfully!');
  };

  const getFilteredTests = () => {
    if (!testSuite) return [];
    if (selectedCategory === 'all') return testSuite.tests;
    return testSuite.tests.filter(test => test.category === selectedCategory);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unit': return <Code className="w-4 h-4" />;
      case 'integration': return <GitBranch className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'e2e': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-income';
      case 'failed': return 'text-expense';
      case 'skipped': return 'text-warning';
      case 'running': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-income" />;
      case 'failed': return <XCircle className="w-4 h-4 text-expense" />;
      case 'skipped': return <Clock className="w-4 h-4 text-warning" />;
      case 'running': return <Activity className="w-4 h-4 text-primary animate-spin" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Comprehensive Test Suite
            </h1>
            <p className="text-muted-foreground mt-1">
              Run automated tests for components, services, security, and performance
            </p>
          </div>
          
          <div className="flex space-x-3">
            {testSuite && (
              <Button 
                variant="outline"
                onClick={exportTestResults}
                className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
            )}
            
            <Button
              onClick={runTests}
              disabled={isRunning}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Test Progress */}
        {isRunning && (
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Running Tests</h3>
                <Badge variant="secondary" className="animate-pulse">
                  In Progress
                </Badge>
              </div>
              
              <Progress value={progress} className="h-3" />
              
              <p className="text-sm text-muted-foreground">
                {currentTest}
              </p>
            </div>
          </Card>
        )}

        {/* Test Results Summary */}
        {testSuite && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card p-6 animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Tests</p>
                  <p className="text-3xl font-bold text-primary">{testSuite.totalTests}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/20">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Passed</p>
                  <p className="text-3xl font-bold text-income">{testSuite.passedTests}</p>
                </div>
                <div className="p-3 rounded-xl bg-income/20">
                  <CheckCircle className="w-6 h-6 text-income" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Failed</p>
                  <p className="text-3xl font-bold text-expense">{testSuite.failedTests}</p>
                </div>
                <div className="p-3 rounded-xl bg-expense/20">
                  <XCircle className="w-6 h-6 text-expense" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Coverage</p>
                  <p className="text-3xl font-bold text-primary">{testSuite.coverage}%</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/20">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Test Results Details */}
        {testSuite && (
          <Card className="glass-card p-6">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Test Results</h3>
                <TabsList className="glass-card">
                  <TabsTrigger value="all">All ({testSuite.totalTests})</TabsTrigger>
                  <TabsTrigger value="unit">
                    <Code className="w-4 h-4 mr-1" />
                    Unit
                  </TabsTrigger>
                  <TabsTrigger value="integration">
                    <GitBranch className="w-4 h-4 mr-1" />
                    Integration
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="w-4 h-4 mr-1" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="performance">
                    <Zap className="w-4 h-4 mr-1" />
                    Performance
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={selectedCategory} className="mt-0">
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {getFilteredTests().map((test, index) => (
                    <div 
                      key={test.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        test.status === 'passed' ? 'border-income/30 bg-income/5' :
                        test.status === 'failed' ? 'border-expense/30 bg-expense/5' :
                        test.status === 'skipped' ? 'border-warning/30 bg-warning/5' :
                        'border-primary/30 bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          test.status === 'passed' ? 'bg-income/20' :
                          test.status === 'failed' ? 'bg-expense/20' :
                          test.status === 'skipped' ? 'bg-warning/20' :
                          'bg-primary/20'
                        }`}>
                          {getStatusIcon(test.status)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{test.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryIcon(test.category)}
                              <span className="ml-1 capitalize">{test.category}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {test.description}
                          </p>
                          {test.error && (
                            <p className="text-sm text-expense mt-1">
                              Error: {test.error}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">
                            {test.duration}ms
                          </span>
                          {test.coverage && (
                            <Badge variant="secondary" className="text-xs">
                              {test.coverage}% coverage
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                          {test.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {/* Export Instructions */}
        {testSuite && (
          <Card className="glass-card p-6 animate-fade-in">
            <div className="flex items-start space-x-4">
              <Download className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Export Test Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the "Export Results" button above to download a comprehensive CSV report containing:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Individual test results with pass/fail status</li>
                  <li>Execution times and performance metrics</li>
                  <li>Code coverage percentages</li>
                  <li>Error messages and debugging information</li>
                  <li>Test summary with success rates</li>
                  <li>Category-wise performance analysis</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}