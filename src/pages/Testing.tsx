import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  GitBranch,
  FileText,
  TestTube2,
  BarChart3,
  AlertTriangle,
  Info
} from 'lucide-react';
import { TestRunner, TestResult, TestSuite } from '@/lib/testing';
import { ExportService } from '@/lib/export';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Testing() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testHistory, setTestHistory] = useState<TestSuite[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const testRunner = new TestRunner();

  // Load test history on component mount
  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading test history:', error);
        return;
      }

      // Group test results by test_suite_id
      const groupedTests: { [key: string]: TestResult[] } = {};
      data?.forEach(result => {
        if (!groupedTests[result.test_suite_id]) {
          groupedTests[result.test_suite_id] = [];
        }
        groupedTests[result.test_suite_id].push({
          id: result.id,
          name: result.test_name,
          category: result.test_category as 'functional' | 'performance' | 'security' | 'localization' | 'payment' | 'api' | 'uat' | 'compatibility' | 'accessibility' | 'regression',
          status: result.status as 'passed' | 'failed' | 'skipped' | 'running',
          timestamp: result.created_at,
          description: `Test executed at ${new Date(result.created_at).toLocaleString()}`,
          duration: result.duration_ms || 0,
          coverage: result.coverage_percentage || 0,
          error: result.error_message || undefined,
          stackTrace: result.stack_trace || undefined,
          createdAt: result.created_at
        });
      });

      // Convert to TestSuite format
      const history: TestSuite[] = Object.entries(groupedTests).map(([suiteId, tests]) => {
        const passedTests = tests.filter(t => t.status === 'passed').length;
        const failedTests = tests.filter(t => t.status === 'failed').length;
        const coverage = Math.round(
          tests.reduce((sum, t) => sum + (t.coverage || 0), 0) / tests.length
        );

        return {
          id: suiteId,
          name: `Test Suite ${suiteId.slice(0, 8)}`,
          tests,
          totalTests: tests.length,
          passedTests,
          failedTests,
          skippedTests: tests.filter(t => t.status === 'skipped').length,
          coverage,
          totalDuration: tests.reduce((sum, t) => sum + (t.duration || 0), 0),
          timestamp: tests[0]?.createdAt || new Date().toISOString(),
          environment: 'production',
          localization: {
            currency: 'INR (₹)',
            timezone: 'IST (UTC+5:30)',
            dateFormat: 'DD/MM/YYYY'
          }
        };
      });

      setTestHistory(history);
    } catch (error) {
      console.error('Error loading test history:', error);
      toast.error('Failed to load test history');
    }
  };

  const saveTestResults = async (suite: TestSuite) => {
    try {
      const testResultsData = suite.tests.map(test => ({
        test_suite_id: suite.id,
        test_name: test.name,
        test_category: test.category,
        status: test.status,
        duration_ms: test.duration,
        coverage_percentage: test.coverage,
        error_message: test.error,
        stack_trace: test.stackTrace,
        test_data: {
          description: test.description,
          indianContext: test.indianContext,
          performanceMetrics: test.performanceMetrics,
          securityDetails: test.securityDetails
        },
        environment: 'production'
      }));

      const { error } = await supabase
        .from('test_results')
        .insert(testResultsData);

      if (error) {
        console.error('Error saving test results:', error);
        toast.error('Failed to save test results to database');
      } else {
        toast.success('Test results saved to database');
        loadTestHistory(); // Refresh history
      }
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error('Failed to save test results');
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestSuite(null);
    setCurrentTest('Initializing comprehensive test suite...');

    try {
      // Simulate progressive testing with real-time updates
      const progressSteps = [
        { step: 10, message: 'Setting up test environment...' },
        { step: 20, message: 'Running unit tests...' },
        { step: 35, message: 'Executing integration tests...' },
        { step: 50, message: 'Performing security scans...' },
        { step: 65, message: 'Running performance benchmarks...' },
        { step: 80, message: 'Executing end-to-end tests...' },
        { step: 90, message: 'Generating coverage reports...' },
        { step: 95, message: 'Finalizing test results...' }
      ];

      for (const { step, message } of progressSteps) {
        setProgress(step);
        setCurrentTest(message);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Run actual tests
      const suite = await testRunner.runAllTests();
      setTestSuite(suite);
      setProgress(100);
      setCurrentTest('Tests completed successfully');
      
      // Save results to database
      await saveTestResults(suite);
      
      toast.success(`Tests completed: ${suite.passedTests}/${suite.totalTests} passed (${suite.coverage}% coverage)`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Test execution failed: ' + error.message);
      } else {
        toast.error('Test execution failed: Unknown error');
      }
      setCurrentTest('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const exportTestResults = () => {
    if (!testSuite) {
      toast.error('No test results to export');
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      let content: string;
      let filename: string;

      if (exportFormat === 'csv') {
        content = ExportService.exportTestResults(testSuite.tests, true);
        filename = `comprehensive-test-results-${timestamp}.csv`;
        ExportService.downloadFile(content, filename, 'text/csv');
      } else {
        const exportData = {
          testSuite: {
            id: testSuite.id,
            name: testSuite.name,
            totalTests: testSuite.totalTests,
            passedTests: testSuite.passedTests,
            failedTests: testSuite.failedTests,
            skippedTests: testSuite.skippedTests,
            coverage: testSuite.coverage,
            totalDuration: testSuite.totalDuration,
            timestamp: testSuite.timestamp,
            environment: testSuite.environment,
            localization: testSuite.localization
          },
          tests: testSuite.tests,
          summary: {
            successRate: ((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(2),
            averageDuration: (testSuite.totalDuration / testSuite.totalTests).toFixed(2),
            categoryCoverage: {
              functional: testSuite.tests.filter(t => t.category === 'functional').length,
              performance: testSuite.tests.filter(t => t.category === 'performance').length,
              security: testSuite.tests.filter(t => t.category === 'security').length,
              localization: testSuite.tests.filter(t => t.category === 'localization').length,
              payment: testSuite.tests.filter(t => t.category === 'payment').length,
              api: testSuite.tests.filter(t => t.category === 'api').length,
              uat: testSuite.tests.filter(t => t.category === 'uat').length,
              compatibility: testSuite.tests.filter(t => t.category === 'compatibility').length,
              accessibility: testSuite.tests.filter(t => t.category === 'accessibility').length,
              regression: testSuite.tests.filter(t => t.category === 'regression').length
            }
          },
          exportMetadata: {
            exportedAt: new Date().toISOString(),
            exportFormat: 'json',
            totalRecords: testSuite.tests.length,
            applicationVersion: '1.0.0',
            testFramework: 'Comprehensive Test Suite'
          }
        };
        
        content = JSON.stringify(exportData, null, 2);
        filename = `comprehensive-test-results-${timestamp}.json`;
        ExportService.downloadFile(content, filename, 'application/json');
      }
      
      toast.success(`Test results exported as ${exportFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export test results');
    }
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
    <div className="p-6 animate-fade-in min-h-screen finance-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <TestTube2 className="inline-block w-8 h-8 mr-3 text-primary" />
              Comprehensive Testing Suite
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Professional-grade testing framework for software engineering excellence
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Unit • Integration • Security • Performance • End-to-End Testing
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {testSuite && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Export as:</label>
                  <select 
                    value={exportFormat} 
                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'json')}
                    className="px-3 py-1 rounded-md border bg-background text-sm"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
                <Button 
                  variant="outline"
                  onClick={exportTestResults}
                  className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </>
            )}
            
            <Button
              onClick={runTests}
              disabled={isRunning}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 min-w-40"
            >
              {isRunning ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Information Alert */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            <strong>Software Engineering Course Testing:</strong> This comprehensive testing suite covers all aspects of software quality assurance including unit testing, integration testing, security scanning, performance benchmarking, and end-to-end testing. Results are automatically saved to the database for academic documentation and can be exported in multiple formats for coursework submission.
          </AlertDescription>
        </Alert>

        {/* Test Progress */}
        {isRunning && (
          <Card className="glass-card p-8 border-2 border-primary/20">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Activity className="w-6 h-6 text-primary animate-pulse" />
                  Running Comprehensive Tests
                </h3>
                <Badge variant="secondary" className="animate-pulse px-4 py-2 text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  In Progress
                </Badge>
              </div>
              
              <Progress value={progress} className="h-4" />
              
              <p className="text-base text-muted-foreground font-medium">
                {currentTest}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Code className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Unit Tests</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <GitBranch className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Integration</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Security</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Performance</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Test Results Summary */}
        {testSuite && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card p-6 animate-scale-in border-2 border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Total Tests</p>
                  <p className="text-4xl font-bold text-primary mt-2">{testSuite.totalTests}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {testSuite.totalDuration}ms total duration
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/20">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in border-2 border-income/10" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Passed</p>
                  <p className="text-4xl font-bold text-income mt-2">{testSuite.passedTests}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}% success rate
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-income/20">
                  <CheckCircle className="w-8 h-8 text-income" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in border-2 border-expense/10" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Failed</p>
                  <p className="text-4xl font-bold text-expense mt-2">{testSuite.failedTests}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {testSuite.failedTests > 0 && (
                      <span className="text-expense">Requires attention</span>
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-expense/20">
                  <XCircle className="w-8 h-8 text-expense" />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 animate-scale-in border-2 border-accent/10" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Coverage</p>
                  <p className="text-4xl font-bold text-accent mt-2">{testSuite.coverage}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Code coverage achieved
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-accent/20">
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Test Results Details */}
        {testSuite && (
          <Card className="glass-card p-8 border-2 border-primary/10">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl font-bold flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    Detailed Test Results
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive analysis of all test executions
                  </p>
                </div>
                
                <TabsList className="glass-card grid grid-cols-3 lg:grid-cols-6 gap-1 p-1">
                  <TabsTrigger value="all" className="text-xs">
                    All ({testSuite.totalTests})
                  </TabsTrigger>
                  <TabsTrigger value="unit" className="text-xs">
                    <Code className="w-4 h-4 mr-1" />
                    Unit
                  </TabsTrigger>
                  <TabsTrigger value="integration" className="text-xs">
                    <GitBranch className="w-4 h-4 mr-1" />
                    Integration
                  </TabsTrigger>
                  <TabsTrigger value="security" className="text-xs">
                    <Shield className="w-4 h-4 mr-1" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs">
                    <Zap className="w-4 h-4 mr-1" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="e2e" className="text-xs">
                    <Activity className="w-4 h-4 mr-1" />
                    E2E
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={selectedCategory} className="mt-0">
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {getFilteredTests().length === 0 ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg">
                        No tests found for category: {selectedCategory}
                      </p>
                    </div>
                  ) : (
                    getFilteredTests().map((test, index) => (
                      <div 
                        key={test.id}
                        className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          test.status === 'passed' 
                            ? 'border-income/30 bg-income/5 hover:border-income/50' :
                          test.status === 'failed' 
                            ? 'border-expense/30 bg-expense/5 hover:border-expense/50' :
                          test.status === 'skipped' 
                            ? 'border-warning/30 bg-warning/5 hover:border-warning/50' :
                            'border-primary/30 bg-primary/5 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-6 flex-1">
                          <div className={`p-3 rounded-xl ${
                            test.status === 'passed' ? 'bg-income/20' :
                            test.status === 'failed' ? 'bg-expense/20' :
                            test.status === 'skipped' ? 'bg-warning/20' :
                            'bg-primary/20'
                          }`}>
                            {getStatusIcon(test.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="font-semibold text-lg truncate">{test.name}</h4>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {getCategoryIcon(test.category)}
                                <span className="ml-1 capitalize">{test.category}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {test.description}
                            </p>
                            
                            {/* Additional test details */}
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span>Duration: {test.duration}ms</span>
                              {test.coverage && <span>Coverage: {test.coverage}%</span>}
                              {test.indianContext?.currency && <span>Currency: {test.indianContext.currency}</span>}
                              {test.indianContext?.location && <span>Location: {test.indianContext.location}</span>}
                              {test.performanceMetrics?.memoryUsage && <span>Memory: {test.performanceMetrics.memoryUsage}MB</span>}
                            </div>
                            
                            {test.error && (
                              <Alert className="mt-3 border-expense/30 bg-expense/5">
                                <AlertTriangle className="h-4 w-4 text-expense" />
                                <AlertDescription className="text-sm">
                                  <strong>Error:</strong> {test.error}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2 ml-6">
                          <p className={`text-lg font-bold ${getStatusColor(test.status)}`}>
                            {test.status.toUpperCase()}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>{new Date(test.timestamp).toLocaleTimeString()}</div>
                            <Badge variant="secondary" className="text-xs">
                              Production
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {/* Export Instructions */}
        {testSuite && (
          <Card className="glass-card p-8 animate-fade-in border-2 border-accent/20">
            <div className="flex items-start space-x-6">
              <div className="p-4 rounded-xl bg-accent/20 shrink-0">
                <Download className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-accent">
                  Professional Test Documentation Export
                </h3>
                <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                  Click the "Export Results" button above to download comprehensive test documentation suitable for software engineering coursework and professional presentations.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">CSV Export Includes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Individual test results with pass/fail status</li>
                      <li>Execution times and performance metrics</li>
                      <li>Code coverage percentages by category</li>
                      <li>Detailed error messages and stack traces</li>
                      <li>Memory usage and environmental data</li>
                      <li>Comprehensive test summary statistics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-accent">JSON Export Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Structured data for programmatic analysis</li>
                      <li>Complete test suite metadata</li>
                      <li>Category-wise test distribution</li>
                      <li>Success rates and performance averages</li>
                      <li>Export timestamp and version information</li>
                      <li>Machine-readable format for CI/CD integration</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Academic Note:</strong> These comprehensive test reports demonstrate professional software engineering practices including automated testing, continuous integration, quality assurance, and documentation standards required in modern software development environments.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Test History */}
        {testHistory.length > 0 && (
          <Card className="glass-card p-8 border-2 border-muted/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Test History
              <Badge variant="secondary" className="ml-2">{testHistory.length} runs</Badge>
            </h3>
            
            <div className="grid gap-4 max-h-96 overflow-y-auto custom-scrollbar">
              {testHistory.slice(0, 10).map((suite, index) => (
                <div key={suite.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Badge variant={suite.failedTests > 0 ? "destructive" : "default"}>
                      {suite.passedTests}/{suite.totalTests}
                    </Badge>
                    <div>
                      <p className="font-medium">{suite.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(suite.timestamp).toLocaleString()} • {suite.coverage}% coverage
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{suite.totalDuration}ms</div>
                    <div className="capitalize">{suite.environment}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}