import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Wallet,
  ExternalLink,
  Award,
  BookOpen,
  Calendar,
  Fingerprint,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

function App() {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [contractAdmin, setContractAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' or 'issue'

  // Issue Form State
  const [issueData, setIssueData] = useState({ id: '', name: '', course: '', hash: '' });

  // Verify State
  const [searchId, setSearchId] = useState('');
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    checkWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkAdminStatus(accounts[0]);
        } else {
          setAccount('');
          setIsAdmin(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const checkWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        
        // Hardhat local network ID is 1337 as per config
        if (network.chainId !== 1337n) {
        setIsWrongNetwork(true);
        setMessage({ text: `Wrong Network: Connected to Chain ID ${network.chainId}. Please switch to Localhost 8545 (Chain ID: 1337).`, type: 'error' });
        return;
      }

      // Check if contract exists at address
      const code = await provider.getCode(CONTRACT_ADDRESS);
      console.log("Contract Code Check:", { address: CONTRACT_ADDRESS, codeLength: code.length });
      
      if (code === '0x' || code === '0x0') {
        setMessage({ 
          text: `Contract not found at ${CONTRACT_ADDRESS.slice(0, 8)}... on Chain ${network.chainId}. Did you restart the node?`, 
          type: 'error' 
        });
        return;
      }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkAdminStatus(accounts[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        checkAdminStatus(accounts[0]);
        setMessage({ text: 'Wallet connected!', type: 'success' });
      } catch (err) {
        setMessage({ text: 'Failed to connect wallet', type: 'error' });
      }
    } else {
      setMessage({ text: 'Please install MetaMask', type: 'error' });
    }
  };

  const checkAdminStatus = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const adminAddress = await contract.admin();
      setContractAdmin(adminAddress);
      setIsAdmin(adminAddress.toLowerCase() === userAddress.toLowerCase());
    } catch (err) {
      console.error("Admin check failed", err);
      if (err.code === 'BAD_DATA') {
        setMessage({ text: 'Contract not found at this address. Please ensure the contract is deployed to your local node.', type: 'error' });
      }
    }
  };

  const issueCertificate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setLoading(true);
    setMessage({ text: 'Processing blockchain transaction...', type: 'info' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCertificate(
        issueData.id,
        issueData.name,
        issueData.course,
        issueData.hash
      );
      await tx.wait();
      setMessage({ text: 'Certificate issued successfully on Blockchain!', type: 'success' });
      setIssueData({ id: '', name: '', course: '', hash: '' });
    } catch (err) {
      console.error(err);
      setMessage({ text: err.reason || 'Failed to issue certificate', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async (e) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    setCertificate(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const [name, course, hash, exists] = await contract.getCertificate(searchId);
      
      if (exists) {
        setCertificate({ name, course, hash, id: searchId });
        setMessage({ text: 'Certificate verified on-chain!', type: 'success' });
      } else {
        setMessage({ text: 'Invalid Certificate ID or not found.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'BAD_DATA') {
        setMessage({ text: 'Blockchain sync error: Contract address mismatch. Restart node and redeploy.', type: 'error' });
      } else {
        setMessage({ text: 'Error connecting to blockchain', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-primary-500/30 selection:text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] animate-float"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/10 px-6 py-4 backdrop-blur-xl bg-slate-950/50 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">BLOCK<span className="text-primary-400">CERT</span></h1>
              <p className="text-[10px] font-bold text-primary-400/60 uppercase tracking-[0.2em] leading-none">Immutable Ledger</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('verify')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'verify' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Verify
            </button>
            <button 
              onClick={() => setActiveTab('issue')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'issue' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${!isAdmin && account ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Issue Portal
            </button>
          </div>

          <div className="flex items-center gap-4">
            {account ? (
              <div className="flex items-center gap-3 bg-white/5 pl-4 pr-1.5 py-1.5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <span className="text-xs font-bold text-slate-300">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                  {isAdmin ? 'ADM' : 'USR'}
                </div>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="bg-white text-slate-950 hover:bg-primary-50 px-6 py-2.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-white/5 flex items-center gap-2 active:scale-95"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></div>
            Powered by Ethereum
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            Verify Excellence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-accent-400 animate-gradient-x">On The Blockchain.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 font-medium text-lg md:text-xl mb-12 leading-relaxed">
            The next generation of academic credentialing. Fast, immutable, and globally verifiable.
          </p>
        </div>
      </section>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        {/* Network Warning */}
        {isWrongNetwork && (
          <div className="mb-8 max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-4 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <p className="font-bold text-sm">{message.text}</p>
          </div>
        )}

        {/* Alerts */}
        {message.text && (
          <div className={`mb-12 max-w-2xl mx-auto p-4 rounded-2xl flex items-center gap-4 border backdrop-blur-xl animate-fade-in animate-slide-in-from-top ${
            message.type === 'error' ? 'bg-accent-500/10 border-accent-500/20 text-accent-400' : 
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
            'bg-primary-500/10 border-primary-500/20 text-primary-400'
          }`}>
            <div className={`p-2 rounded-xl ${
              message.type === 'error' ? 'bg-accent-500/20' : 
              message.type === 'success' ? 'bg-emerald-500/20' : 'bg-primary-500/20'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <p className="font-bold text-sm">{message.text}</p>
            <button onClick={() => setMessage({text:'', type:''})} className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'verify' ? (
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Search Section */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter ID: e.g. CERT-001"
                    className="w-full pl-16 pr-8 py-6 bg-slate-900/50 rounded-3xl border-2 border-white/5 focus:border-primary-500 focus:bg-slate-900 outline-none transition-all font-bold text-xl text-white placeholder:text-slate-600 shadow-2xl"
                  />
                </div>
                <button 
                  onClick={verifyCertificate}
                  disabled={loading || !searchId}
                  className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-12 py-6 rounded-3xl font-black transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                  Verify
                </button>
              </div>
            </div>

            {/* Certificate Preview Card */}
            {certificate ? (
              <div className="animate-zoom-in animate-fade-in">
                <div className="relative group max-w-4xl mx-auto">
                  {/* Outer Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-amber-200/30 rounded-[48px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  
                  {/* The Physical Paper Design */}
                  <div className="relative bg-[#fdfbf7] p-12 md:p-24 rounded-[40px] shadow-2xl overflow-hidden border-[16px] border-[#2c3e50]/5">
                    {/* Decorative Intricate Border */}
                    <div className="absolute inset-4 border-8 border-double border-amber-900/10 rounded-[28px] pointer-events-none"></div>
                    <div className="absolute inset-8 border border-amber-900/5 rounded-[20px] pointer-events-none"></div>
                    
                    {/* Corner Ornaments */}
                    <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-amber-900/20 rounded-tl-xl"></div>
                    <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-amber-900/20 rounded-tr-xl"></div>
                    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-amber-900/20 rounded-bl-xl"></div>
                    <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-amber-900/20 rounded-br-xl"></div>

                    {/* Certificate Content */}
                    <div className="relative z-10 text-center space-y-12">
                      {/* Header */}
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-amber-900/5 rounded-full flex items-center justify-center border border-amber-900/10 shadow-inner">
                          <Award className="w-12 h-12 text-amber-900/80" strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                          <h1 className="font-serif text-4xl tracking-[0.2em] text-amber-950 uppercase font-black">Certificate of Completion</h1>
                          <p className="text-[10px] font-black tracking-[0.5em] text-amber-900/40 uppercase">BlockCert Immutable Academic Record</p>
                        </div>
                        <div className="h-px w-64 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent"></div>
                      </div>

                      <div className="space-y-6">
                        <p className="font-serif text-amber-900/60 italic text-xl">This is to officially certify that</p>
                        <h2 className="text-6xl md:text-7xl font-serif text-amber-950 font-black tracking-tight drop-shadow-sm">{certificate.name}</h2>
                      </div>

                      <div className="space-y-6">
                        <p className="font-serif text-amber-900/60 italic text-xl">has successfully completed all requirements for the course of</p>
                        <h3 className="text-4xl font-serif text-amber-900 font-bold uppercase tracking-widest">{certificate.course}</h3>
                        <p className="text-amber-900/40 text-sm font-medium max-w-lg mx-auto leading-relaxed">
                          Demonstrating exceptional proficiency and commitment to academic excellence, verified through decentralized cryptographic protocols.
                        </p>
                      </div>

                      {/* Seal & Signatures */}
                      <div className="grid grid-cols-3 gap-12 mt-20 pt-16">
                        <div className="flex flex-col items-center justify-end space-y-4">
                          <div className="w-full h-px bg-amber-900/20"></div>
                          <p className="text-[9px] font-black uppercase text-amber-900/40 tracking-widest">Registrar Signature</p>
                        </div>
                        
                        {/* Official Blockchain Wax Seal */}
                        <div className="relative flex items-center justify-center scale-110">
                          <div className="absolute w-36 h-36 bg-amber-600/10 rounded-full blur-2xl"></div>
                          <div className="relative w-28 h-28 rounded-full border-4 border-double border-amber-700/40 flex flex-col items-center justify-center p-2 text-center bg-[#fdfbf7] shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-700 cursor-help group/seal">
                            <ShieldCheck className="w-10 h-10 text-amber-700/60 mb-1 group-hover:text-emerald-600 transition-colors" />
                            <p className="text-[7px] font-black text-amber-900/60 leading-tight uppercase">Authentic<br/>Blockchain Seal</p>
                            <div className="absolute -bottom-2 px-2 py-0.5 bg-emerald-500 text-white text-[6px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-end space-y-4">
                          <div className="w-full h-px bg-amber-900/20"></div>
                          <p className="text-[9px] font-black uppercase text-amber-900/40 tracking-widest">Dean Signature</p>
                        </div>
                      </div>

                      {/* Bottom Details Bar */}
                      <div className="mt-16 pt-10 grid grid-cols-2 gap-12 text-left border-t border-amber-900/5">
                        <div className="space-y-2">
                          <p className="text-[8px] font-black uppercase text-amber-900/30 tracking-widest">Cryptographic ID</p>
                          <p className="text-[11px] font-mono text-amber-900/60 font-bold break-all bg-amber-900/5 p-3 rounded-xl border border-amber-900/5">
                            {certificate.id}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-[8px] font-black uppercase text-amber-900/30 tracking-widest">Verification Date</p>
                          <p className="text-sm font-serif text-amber-900/70 font-bold italic">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <div className="flex justify-end gap-2 mt-2">
                            <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-tighter border border-emerald-500/20">On-Chain Active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 mt-12">
                    <button 
                      onClick={() => window.print()}
                      className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3 group/btn shadow-2xl"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Download Original Image (PDF)
                    </button>
                    <button 
                      onClick={() => setCertificate(null)}
                      className="px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white font-black uppercase tracking-widest text-[11px] transition-all"
                    >
                      Verify Another
                    </button>
                  </div>
                </div>
              </div>
            ) : !loading && (
              <div className="py-24 text-center space-y-6 opacity-20">
                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto border border-white/10">
                  <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <p className="font-bold text-slate-400 text-lg">Enter a valid ID to retrieve credential</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {!isAdmin ? (
              <div className="bg-accent-500/5 border-2 border-accent-500/10 rounded-[40px] p-12 md:p-20 text-center space-y-8 backdrop-blur-2xl">
                <div className="w-24 h-24 bg-accent-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-accent-500/20">
                  <AlertCircle className="w-10 h-10 text-accent-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white">Access Restricted</h3>
                  <div className="space-y-2">
                    <p className="text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
                      This portal is reserved for authorized issuing bodies. Please connect with the administrator's cryptographic identity.
                    </p>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mt-8 space-y-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-primary-400 tracking-[0.2em] mb-2 text-center">Authorized Admin Account</p>
                          <code className="text-[11px] text-emerald-400 font-mono break-all block bg-black/30 p-3 rounded-xl border border-emerald-500/20">{contractAdmin}</code>
                        </div>
                        <p className="text-[10px] text-white/40 text-center font-bold uppercase tracking-widest italic">
                          Please ensure you have switched to this account in MetaMask to issue certificates.
                        </p>
                      </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab('verify')}
                    className="bg-white/10 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-white/20 border border-white/10"
                  >
                    Return to Verification
                  </button>
                  <button 
                    onClick={connectWallet}
                    className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black transition-all hover:bg-primary-50 shadow-xl"
                  >
                    Switch Account
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tip: If using Hardhat, connect to Chain ID: 1337
                </p>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-6 mb-12">
                  <div className="bg-primary-500/10 p-4 rounded-[24px] border border-primary-500/20 shadow-inner">
                    <PlusCircle className="w-8 h-8 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Issue Credential</h2>
                    <p className="text-sm font-bold text-primary-400/60 uppercase tracking-widest">Minting new immutable record</p>
                  </div>
                </div>

                <form onSubmit={issueCertificate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black uppercase text-primary-400/60 ml-2 tracking-widest group-focus-within:text-primary-400 transition-colors">Unique Record ID</label>
                      <div className="relative">
                        <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                        <input 
                          required
                          type="text" 
                          value={issueData.id}
                          onChange={(e) => setIssueData({...issueData, id: e.target.value})}
                          className="w-full pl-14 pr-6 py-5 bg-slate-900/50 rounded-2xl border-2 border-white/5 focus:border-primary-500 focus:bg-slate-900 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                          placeholder="e.g. BC-2026-99"
                        />
                      </div>
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black uppercase text-primary-400/60 ml-2 tracking-widest group-focus-within:text-primary-400 transition-colors">Document Hash</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                        <input 
                          required
                          type="text" 
                          value={issueData.hash}
                          onChange={(e) => setIssueData({...issueData, hash: e.target.value})}
                          className="w-full pl-14 pr-6 py-5 bg-slate-900/50 rounded-2xl border-2 border-white/5 focus:border-primary-500 focus:bg-slate-900 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase text-primary-400/60 ml-2 tracking-widest group-focus-within:text-primary-400 transition-colors">Recipient Full Name</label>
                    <div className="relative">
                      <PlusCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                      <input 
                        required
                        type="text" 
                        value={issueData.name}
                        onChange={(e) => setIssueData({...issueData, name: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-900/50 rounded-2xl border-2 border-white/5 focus:border-primary-500 focus:bg-slate-900 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase text-primary-400/60 ml-2 tracking-widest group-focus-within:text-primary-400 transition-colors">Course or Certification Title</label>
                    <div className="relative">
                      <Award className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                      <input 
                        required
                        type="text" 
                        value={issueData.course}
                        onChange={(e) => setIssueData({...issueData, course: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-900/50 rounded-2xl border-2 border-white/5 focus:border-primary-500 focus:bg-slate-900 outline-none transition-all font-bold text-white placeholder:text-slate-700"
                        placeholder="Blockchain Engineering Expert"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white py-6 rounded-3xl font-black transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                    Mint Certificate Record
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <ShieldCheck className="w-6 h-6 text-primary-400" />
            <span className="text-lg font-black tracking-tighter">BLOCKCERT</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            © 2026 Secured by Ethereum Decentralized Ledger
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-slate-500 hover:text-primary-400 transition-colors"><ExternalLink className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
      {/* Debug Info Footer */}
      <div className="fixed bottom-4 left-4 flex gap-4 text-[9px] font-mono text-white/20 uppercase tracking-widest bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5 pointer-events-none">
        <span>Network: 1337</span>
        <span>•</span>
        <span>Contract: {CONTRACT_ADDRESS.slice(0, 10)}...</span>
        <span>•</span>
        <span>Account: {account ? account.slice(0, 8) : 'Not Connected'}</span>
      </div>
    </div>
  );
}

export default App;
