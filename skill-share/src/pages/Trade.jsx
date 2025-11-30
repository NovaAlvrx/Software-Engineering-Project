import { useMemo, useState, useEffect, useContext } from 'react';
import './Trade.css';
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';

const API_BASE = 'http://localhost:8000';

const contacts = [
  {
    userId: 2,
    username: 'Maria_Ferdous_1',
    name: 'Maria Ferdous',
    avatar: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    skillsOffered: ['Portrait Photography Walkthrough', 'Food Styling Lessons'],
    lookingFor: ['React Mentorship', 'Web Accessibility Audit'],
    availability: 'Weekends',
  },
  {
    userId: 3,
    username: 'Noah_Alvarez_1',
    name: 'Noah Alvarez',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3CTw87kjAiRHrKO-IvKZtBI76VuTKcgKWeA&s',
    skillsOffered: ['Python Automation Deep Dive', 'Machine Learning Study Group'],
    lookingFor: ['Product Photography Critiques', 'Sourdough Lessons'],
    availability: 'Weeknights',
  },
  {
    userId: 4,
    username: 'Gerardo_Rivera_1',
    name: 'Gerardo Rivera',
    avatar: 'https://cdn.pixabay.com/photo/2022/08/17/15/46/labrador-7392840_640.jpg',
    skillsOffered: ['Game Design Brainstorm', 'Blender Workflow'],
    lookingFor: ['UX Portfolio Review', 'Front-end Architecture Coaching'],
    availability: 'Flexible',
  },
  {
    userId: 5,
    username: 'Suzuna_Kimura_1',
    name: 'Suzuna Kimura',
    avatar: 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
    skillsOffered: ['Creative Direction Feedback', 'Film Photography Session'],
    lookingFor: ['Node.js Pairing', 'Email Marketing Strategy'],
    availability: 'Mornings',
  },
];

const sampleIncomingRequests = [
  {
    id: 1,
    username: 'Maria_Ferdous_1',
    offer: 'Portrait Photography Walkthrough',
    request: 'React Mentorship (2 sessions)',
    availability: 'Saturdays • 10 AM PST',
    message: 'I can show you my portrait lighting setup and would love help brushing up on React hooks.',
    status: 'PENDING',
    sent: '2h ago',
  },
];

const sampleOutgoingRequests = [
  {
    id: 101,
    username: 'Gerardo_Rivera_1',
    offer: 'UX Portfolio Review',
    request: 'Game Design Brainstorm',
    availability: 'Flexible',
    message: 'I can review your UX flows asynchronously if we can hop on a game design call next week.',
    status: 'PENDING',
    sent: '4h ago',
  },
];

const currentUserSkills = [
  'React Mentorship',
  'UX Portfolio Review',
  'Web Accessibility Audit',
  'Email Marketing Strategy',
];

const statusLabels = {
  PENDING: 'Awaiting response',
  ACCEPTED: 'Exchange confirmed',
  DECLINED: 'Declined',
  COMPLETED: 'Completed',
};

const tabs = [
  { id: 'incoming', label: 'Incoming trades' },
  { id: 'propose', label: 'Request a trade' },
  { id: 'history', label: 'Trade history' },
];

function Trade() {
  const user = useContext(UserContext);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [proposalForm, setProposalForm] = useState({
    username: '',
    offerSkill: '',
    requestSkill: '',
    availability: '',
    note: '',
  });
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('incoming');
  const [loadingTrades, setLoadingTrades] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setIncomingRequests(sampleIncomingRequests);
      setOutgoingRequests(sampleOutgoingRequests);
      return;
    }

    const fetchTrades = async () => {
      setLoadingTrades(true);
      try {
        const { data } = await axios.get(`${API_BASE}/trade`, { withCredentials: true });
        const mapTrade = (t) => ({
          id: t.id,
          contactId: t.otherUser?.id,
          username: t.otherUser?.name || `User ${t.otherUser?.id ?? ''}`,
          offer: t.offer || 'Offer not specified',
          request: t.request || 'Request not specified',
          availability: t.availability || 'Flexible',
          message: t.message || '',
          status: (t.status || 'PENDING').toUpperCase(),
          sent: t.sentAt ? new Date(t.sentAt).toLocaleString() : 'Recently',
          avatar: t.otherUser?.profilePicture,
        });
        setIncomingRequests((data.incoming || []).map(mapTrade));
        setOutgoingRequests((data.outgoing || []).map(mapTrade));
      } catch (error) {
        console.error('Failed to load trades:', error);
        setFeedback('Could not load trades. Please ensure you are logged in.');
      } finally {
        setLoadingTrades(false);
      }
    };

    fetchTrades();
  }, [user?.id]);

  const pendingIncoming = useMemo(
    () => incomingRequests.filter((request) => request.status === 'PENDING').length,
    [incomingRequests],
  );

  const pendingOutgoing = useMemo(
    () => outgoingRequests.filter((request) => request.status === 'PENDING').length,
    [outgoingRequests],
  );

  const successfulTrades = useMemo(() => {
    const fromIncoming = incomingRequests.filter((request) => request.status === 'ACCEPTED').length;
    const fromOutgoing = outgoingRequests.filter((request) => request.status === 'ACCEPTED').length;
    return fromIncoming + fromOutgoing;
  }, [incomingRequests, outgoingRequests]);

  const recommendedMatches = useMemo(
    () =>
      contacts
        .map((contact) => {
          const overlappingSkill = contact.lookingFor.find((skill) => currentUserSkills.includes(skill));
          return {
            ...contact,
            overlappingSkill: overlappingSkill || contact.lookingFor[0],
          };
        })
        .filter((contact) => !!contact.overlappingSkill)
        .slice(0, 3),
    [],
  );

  const lookupContact = (identifier) =>
    contacts.find((contact) => contact.username === identifier || contact.userId === Number(identifier));

  const tabHelper = {
    incoming: `${pendingIncoming} awaiting reply`,
    propose: 'Craft a new exchange',
    history: `${outgoingRequests.length} sent`,
  };

  const handleDecision = async (requestId, decision) => {
    const statusValue = decision.toUpperCase();
    try {
      await axios.patch(
        `${API_BASE}/trade/${requestId}`,
        { status: statusValue },
        { withCredentials: true },
      );
      setIncomingRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: statusValue,
              }
            : request,
        ),
      );
      const contact = lookupContact(
        incomingRequests.find((request) => request.id === requestId)?.contactId ||
          incomingRequests.find((request) => request.id === requestId)?.username ||
          '',
      );
      setFeedback(
        statusValue === 'ACCEPTED'
          ? `Trade confirmed with ${contact?.name || 'this user'}! Check your messages to coordinate details.`
          : `You declined ${contact?.name || 'this user'}'s exchange.`,
      );
    } catch (error) {
      console.error('Failed to update trade status:', error);
      setFeedback('Could not update trade. Please try again.');
    }
  };

  const handleWithdraw = async (requestId) => {
    try {
      await axios.patch(
        `${API_BASE}/trade/${requestId}`,
        { status: 'DECLINED' },
        { withCredentials: true },
      );
      setOutgoingRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: 'DECLINED',
              }
            : request,
        ),
      );
      setFeedback('Trade proposal withdrawn. You can always send a fresh idea.');
    } catch (error) {
      console.error('Failed to withdraw trade:', error);
      setFeedback('Could not withdraw trade. Please try again.');
    }
  };

  const handleFormChange = (field, value) => {
    setProposalForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePrefillProposal = (contact) => {
    const matchedSkill = contact.lookingFor.find((skill) => currentUserSkills.includes(skill));
    setProposalForm({
      username: contact.userId?.toString() || contact.username,
      offerSkill: matchedSkill || contact.lookingFor[0] || '',
      requestSkill: contact.skillsOffered[0] || '',
      availability: contact.availability || '',
      note: '',
    });
    setFeedback(`Prefilled proposal details for ${contact.name}. Personalize the note before sending!`);
  };

  const handleProposalSubmit = async (event) => {
    event.preventDefault();
    if (!proposalForm.username || !proposalForm.offerSkill || !proposalForm.requestSkill) {
      setFeedback('Please choose a user and describe both skills involved before sending the proposal.');
      return;
    }

    const recipientId = Number(proposalForm.username);
    if (Number.isNaN(recipientId)) {
      setFeedback('Please select a valid user to send a trade request.');
      return;
    }

    const contact = lookupContact(proposalForm.username);
    try {
      const { data } = await axios.post(
        `${API_BASE}/trade`,
        {
          recipientId,
          offer: proposalForm.offerSkill,
          request: proposalForm.requestSkill,
          availability: proposalForm.availability || 'Flexible',
          message: proposalForm.note || 'Excited to trade skills!',
        },
        { withCredentials: true },
      );

      const newRequest = {
        id: data.id,
        contactId: recipientId,
        username: contact?.name || `User ${recipientId}`,
        offer: proposalForm.offerSkill,
        request: proposalForm.requestSkill,
        availability: proposalForm.availability || 'Flexible',
        message: proposalForm.note || 'Excited to trade skills!',
        status: (data.status || 'PENDING').toUpperCase(),
        sent: 'Just now',
        avatar: contact?.avatar,
      };

      setOutgoingRequests((previous) => [newRequest, ...previous]);
      setProposalForm({
        username: '',
        offerSkill: '',
        requestSkill: '',
        availability: '',
        note: '',
      });
      setFeedback(`Trade proposal sent to ${contact?.name || 'the selected user'}!`);
    } catch (error) {
      console.error('Failed to send trade proposal:', error);
      setFeedback('Could not send trade proposal. Please ensure you are logged in.');
    }
  };

  return (
    <div className="trade-page">
      <main className="trade-content">
        <header className="trade-header">
          <div>
            <p className="eyebrow">Skill Exchange Hub</p>
            <h1>Trade skills with confidence</h1>
            <p className="subtitle">
              Review incoming proposals, negotiate exchanges, and send new requests to collaborators you want to learn from.
            </p>
          </div>
        </header>

        <section className="trade-stats">
          <article className="stat-card">
            <p className="stat-label">Incoming requests</p>
            <p className="stat-value">{pendingIncoming}</p>
            <span className="stat-helper">Waiting for your answer</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Proposals sent</p>
            <p className="stat-value">{pendingOutgoing}</p>
            <span className="stat-helper">Awaiting responses</span>
          </article>
          <article className="stat-card">
            <p className="stat-label">Exchanges completed</p>
            <p className="stat-value">{successfulTrades}</p>
            <span className="stat-helper">Keep the momentum going</span>
          </article>
        </section>

        <div className="trade-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`trade-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <small>{tabHelper[tab.id]}</small>
            </button>
          ))}
        </div>

        {feedback && <p className="trade-feedback">{feedback}</p>}

        <div className="tab-panels">
          {activeTab === 'incoming' && (
            <section className="panel tab-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Incoming requests</p>
                  <h2>Review & respond</h2>
                </div>
                <span className="badge">{pendingIncoming} open</span>
              </div>

              {incomingRequests.length === 0 && (
                <div className="empty-state">
                  <p>No incoming requests yet.</p>
                  <span>As soon as someone proposes an exchange you will see it here.</span>
                </div>
              )}

              {incomingRequests.map((request) => {
                const contact = lookupContact(request.contactId ?? request.username);
                const displayName = contact?.name || request.username;
                return (
                  <article key={request.id} className={`trade-card ${request.status.toLowerCase()}`}>
                    <div className="trade-card-header">
                      <div className="avatar" style={{ backgroundImage: `url(${contact?.avatar || request.avatar})` }} />
                      <div>
                        <h3>{displayName}</h3>
                        <p className="small-text">{request.sent}</p>
                      </div>
                      <span className={`status-pill ${request.status.toLowerCase()}`}>{statusLabels[request.status]}</span>
                    </div>

                    <div className="trade-card-body">
                      <div className="trade-skill-block">
                        <p className="eyebrow">They will share</p>
                        <h4>{request.offer}</h4>
                      </div>
                      <div className="trade-skill-block">
                        <p className="eyebrow">They are asking for</p>
                        <h4>{request.request}</h4>
                      </div>
                    </div>

                    <p className="trade-note">{request.message}</p>
                    <p className="trade-availability">Preferred timing: {request.availability}</p>

                    {request.status === 'PENDING' ? (
                      <div className="trade-actions">
                        <button type="button" className="secondary" onClick={() => handleDecision(request.id, 'declined')}>
                          Decline
                        </button>
                        <button type="button" className="primary" onClick={() => handleDecision(request.id, 'accepted')}>
                          Accept exchange
                        </button>
                      </div>
                    ) : (
                      <p className="trade-note muted">You responded to this request.</p>
                    )}
                  </article>
                );
              })}
            </section>
          )}

          {activeTab === 'propose' && (
            <section className="panel tab-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Propose trade/exchange</p>
                  <h2>Send a new request</h2>
                </div>
              </div>

              <form className="trade-form" onSubmit={handleProposalSubmit}>
                <label>
                  Choose a collaborator
                  <select value={proposalForm.username} onChange={(event) => handleFormChange('username', event.target.value)}>
                    <option value="">Select a user</option>
                    {contacts.map((contact) => (
                      <option key={contact.username} value={contact.userId}>
                        {contact.name} (id: {contact.userId}) • offers {contact.skillsOffered[0]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-row">
                  <label>
                    What you&apos;re offering
                    <input
                      type="text"
                      placeholder="e.g. UX Portfolio Review"
                      value={proposalForm.offerSkill}
                      onChange={(event) => handleFormChange('offerSkill', event.target.value)}
                    />
                  </label>

                  <label>
                    What you want to learn
                    <input
                      type="text"
                      placeholder="e.g. Blender Workflow"
                      value={proposalForm.requestSkill}
                      onChange={(event) => handleFormChange('requestSkill', event.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Availability
                  <input
                    type="text"
                    placeholder="Share a couple of windows"
                    value={proposalForm.availability}
                    onChange={(event) => handleFormChange('availability', event.target.value)}
                  />
                </label>

                <label>
                  Personal note
                  <textarea
                    rows={4}
                    placeholder="Share goals, expectation for the exchange, or materials you can prep."
                    value={proposalForm.note}
                    onChange={(event) => handleFormChange('note', event.target.value)}
                  />
                </label>

                <button type="submit" className="primary full-width">
                  Send proposal
                </button>
              </form>

              <div className="recommendations">
                <h3>Suggested matches</h3>
                <p className="small-text">Tap to prefill a proposal with people looking for your skills.</p>
                <div className="recommendation-grid">
                  {recommendedMatches.map((contact) => (
                    <article key={contact.username} className="match-card">
                      <div className="avatar small" style={{ backgroundImage: `url(${contact.avatar})` }} />
                      <div className="match-details">
                        <h4>{contact.name}</h4>
                        <p className="small-text">Looking for {contact.overlappingSkill}</p>
                        <p className="small-text">Offers {contact.skillsOffered[0]}</p>
                      </div>
                      <button type="button" className="secondary compact" onClick={() => handlePrefillProposal(contact)}>
                        Prefill
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'history' && (
            <section className="panel tab-panel outgoing">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Your proposals</p>
                  <h2>Manage outgoing trades</h2>
                </div>
                <span className="badge">{outgoingRequests.length} sent</span>
              </div>

              {outgoingRequests.length === 0 && (
                <div className="empty-state">
                  <p>You have not sent any trades yet.</p>
                </div>
              )}

              {outgoingRequests.map((request) => {
                const contact = lookupContact(request.contactId ?? request.username);
                const displayName = contact?.name || request.username;
                return (
                  <article key={request.id} className={`trade-card ${request.status.toLowerCase()}`}>
                    <div className="trade-card-header">
                      <div className="avatar" style={{ backgroundImage: `url(${contact?.avatar || request.avatar})` }} />
                      <div>
                        <h3>{displayName}</h3>
                        <p className="small-text">{request.sent}</p>
                      </div>
                      <span className={`status-pill ${request.status.toLowerCase()}`}>{statusLabels[request.status]}</span>
                    </div>
                    <div className="trade-card-body">
                      <div className="trade-skill-block">
                        <p className="eyebrow">You&apos;ll share</p>
                        <h4>{request.offer}</h4>
                      </div>
                      <div className="trade-skill-block">
                        <p className="eyebrow">You&apos;ll receive</p>
                        <h4>{request.request}</h4>
                      </div>
                    </div>
                    <p className="trade-note">{request.message}</p>
                    <p className="trade-availability">Availability: {request.availability}</p>
                    {request.status === 'PENDING' && (
                      <div className="trade-actions">
                        <button type="button" className="secondary" onClick={() => handleWithdraw(request.id)}>
                          Withdraw
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Trade;
