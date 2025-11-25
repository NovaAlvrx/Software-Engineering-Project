import { useMemo, useState } from 'react';
import './Trade.css';

const contacts = [
  {
    username: 'Maria_Ferdous_1',
    name: 'Maria Ferdous',
    avatar: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    skillsOffered: ['Portrait Photography Walkthrough', 'Food Styling Lessons'],
    lookingFor: ['React Mentorship', 'Web Accessibility Audit'],
    availability: 'Weekends',
  },
  {
    username: 'Noah_Alvarez_1',
    name: 'Noah Alvarez',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3CTw87kjAiRHrKO-IvKZtBI76VuTKcgKWeA&s',
    skillsOffered: ['Python Automation Deep Dive', 'Machine Learning Study Group'],
    lookingFor: ['Product Photography Critiques', 'Sourdough Lessons'],
    availability: 'Weeknights',
  },
  {
    username: 'Gerardo_Rivera_1',
    name: 'Gerardo Rivera',
    avatar: 'https://cdn.pixabay.com/photo/2022/08/17/15/46/labrador-7392840_640.jpg',
    skillsOffered: ['Game Design Brainstorm', 'Blender Workflow'],
    lookingFor: ['UX Portfolio Review', 'Front-end Architecture Coaching'],
    availability: 'Flexible',
  },
  {
    username: 'Suzuna_Kimura_1',
    name: 'Suzuna Kimura',
    avatar: 'https://images6.alphacoders.com/337/thumb-1920-337780.jpg',
    skillsOffered: ['Creative Direction Feedback', 'Film Photography Session'],
    lookingFor: ['Node.js Pairing', 'Email Marketing Strategy'],
    availability: 'Mornings',
  },
];

const initialIncomingRequests = [
  {
    id: 1,
    username: 'Maria_Ferdous_1',
    offer: 'Portrait Photography Walkthrough',
    request: 'React Mentorship (2 sessions)',
    availability: 'Saturdays • 10 AM PST',
    message: 'I can show you my portrait lighting setup and would love help brushing up on React hooks.',
    status: 'pending',
    sent: '2h ago',
  },
  {
    id: 2,
    username: 'Noah_Alvarez_1',
    offer: 'Python Automation Deep Dive',
    request: 'Product Photography Critiques',
    availability: 'Weeknights • 7 PM CST',
    message: 'Happy to walk through two automation projects in exchange for feedback on my photography portfolio.',
    status: 'pending',
    sent: 'Yesterday',
  },
  {
    id: 3,
    username: 'Suzuna_Kimura_1',
    offer: 'Creative Direction Feedback',
    request: 'Node.js Pairing',
    availability: 'Thursdays • 9 AM JST',
    message: 'Could you pair on my Node API refactor? I will prepare reference boards for you.',
    status: 'accepted',
    sent: 'This week',
  },
];

const initialOutgoingRequests = [
  {
    id: 101,
    username: 'Gerardo_Rivera_1',
    offer: 'UX Portfolio Review',
    request: 'Game Design Brainstorm',
    availability: 'Flexible',
    message: 'I can review your UX flows asynchronously if we can hop on a game design call next week.',
    status: 'pending',
    sent: '4h ago',
  },
  {
    id: 102,
    username: 'Maria_Ferdous_1',
    offer: 'Web Accessibility Audit',
    request: 'Food Styling Lessons',
    availability: 'Weekends',
    message: 'Trying to improve my food photography composition. Happy to share my accessibility checklist.',
    status: 'declined',
    sent: 'Last week',
  },
];

const currentUserSkills = [
  'React Mentorship',
  'UX Portfolio Review',
  'Web Accessibility Audit',
  'Email Marketing Strategy',
];

const statusLabels = {
  pending: 'Awaiting response',
  accepted: 'Exchange confirmed',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
};

const tabs = [
  { id: 'incoming', label: 'Incoming trades' },
  { id: 'propose', label: 'Request a trade' },
  { id: 'history', label: 'Trade history' },
];

function Trade() {
  const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests);
  const [outgoingRequests, setOutgoingRequests] = useState(initialOutgoingRequests);
  const [proposalForm, setProposalForm] = useState({
    username: '',
    offerSkill: '',
    requestSkill: '',
    availability: '',
    note: '',
  });
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('incoming');

  const pendingIncoming = useMemo(
    () => incomingRequests.filter((request) => request.status === 'pending').length,
    [incomingRequests],
  );

  const pendingOutgoing = useMemo(
    () => outgoingRequests.filter((request) => request.status === 'pending').length,
    [outgoingRequests],
  );

  const successfulTrades = useMemo(() => {
    const fromIncoming = incomingRequests.filter((request) => request.status === 'accepted').length;
    const fromOutgoing = outgoingRequests.filter((request) => request.status === 'accepted').length;
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

  const lookupContact = (username) => contacts.find((contact) => contact.username === username);

  const tabHelper = {
    incoming: `${pendingIncoming} awaiting reply`,
    propose: 'Craft a new exchange',
    history: `${outgoingRequests.length} sent`,
  };

  const handleDecision = (requestId, decision) => {
    setIncomingRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: decision,
            }
          : request,
      ),
    );

    const contact = lookupContact(
      incomingRequests.find((request) => request.id === requestId)?.username || '',
    );

    setFeedback(
      decision === 'accepted'
        ? `Trade confirmed with ${contact?.name || 'this user'}! Check your messages to coordinate details.`
        : `You declined ${contact?.name || 'this user'}'s exchange.`,
    );
  };

  const handleWithdraw = (requestId) => {
    setOutgoingRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'withdrawn',
            }
          : request,
      ),
    );
    setFeedback('Trade proposal withdrawn. You can always send a fresh idea.');
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
      username: contact.username,
      offerSkill: matchedSkill || contact.lookingFor[0] || '',
      requestSkill: contact.skillsOffered[0] || '',
      availability: contact.availability || '',
      note: '',
    });
    setFeedback(`Prefilled proposal details for ${contact.name}. Personalize the note before sending!`);
  };

  const handleProposalSubmit = (event) => {
    event.preventDefault();
    if (!proposalForm.username || !proposalForm.offerSkill || !proposalForm.requestSkill) {
      setFeedback('Please choose a user and describe both skills involved before sending the proposal.');
      return;
    }

    const contact = lookupContact(proposalForm.username);
    const newRequest = {
      id: Date.now(),
      username: proposalForm.username,
      offer: proposalForm.offerSkill,
      request: proposalForm.requestSkill,
      availability: proposalForm.availability || 'Flexible',
      message: proposalForm.note || 'Excited to trade skills!',
      status: 'pending',
      sent: 'Just now',
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
                const contact = lookupContact(request.username);
                return (
                  <article key={request.id} className={`trade-card ${request.status}`}>
                    <div className="trade-card-header">
                      <div className="avatar" style={{ backgroundImage: `url(${contact?.avatar})` }} />
                      <div>
                        <h3>{contact?.name || request.username}</h3>
                        <p className="small-text">{request.sent}</p>
                      </div>
                      <span className={`status-pill ${request.status}`}>{statusLabels[request.status]}</span>
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

                    {request.status === 'pending' ? (
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
                      <option key={contact.username} value={contact.username}>
                        {contact.name} • offers {contact.skillsOffered[0]}
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
                const contact = lookupContact(request.username);
                return (
                  <article key={request.id} className={`trade-card ${request.status}`}>
                    <div className="trade-card-header">
                      <div className="avatar" style={{ backgroundImage: `url(${contact?.avatar})` }} />
                      <div>
                        <h3>{contact?.name || request.username}</h3>
                        <p className="small-text">{request.sent}</p>
                      </div>
                      <span className={`status-pill ${request.status}`}>{statusLabels[request.status]}</span>
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
                    {request.status === 'pending' && (
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
