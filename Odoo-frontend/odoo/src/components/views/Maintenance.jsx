import React, { useState } from 'react';
import { useTransitOps } from '../../hooks/TransitOpsContext';

const Maintenance = () => {
  const { 
    maintenance, 
    vehicles, 
    addMaintenance, 
    completeMaintenance, 
    updateMaintenanceStatus,
    triggerToast,
    searchQuery
  } = useTransitOps();

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'service',
    cost: '',
    description: ''
  });

  // Filter vehicles that are not retired, in shop or on trip (Available)
  const availableVehicles = vehicles.filter(v => v.status === 'Available');

  // Filter maintenance tasks by searchQuery
  const filteredMaintenance = maintenance.filter(m => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.id.toLowerCase().includes(query) ||
      (m.vehicleName && m.vehicleName.toLowerCase().includes(query)) ||
      (m.vehicleReg && m.vehicleReg.toLowerCase().includes(query)) ||
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.description && m.description.toLowerCase().includes(query))
    );
  });

  // Group maintenance tasks by status columns
  const scheduledTasks = filteredMaintenance.filter(m => m.status === 'Scheduled');
  const inProgressTasks = filteredMaintenance.filter(m => m.status === 'In Progress');
  const completedTasks = filteredMaintenance.filter(m => m.status === 'Completed');

  const handleOpenAddModal = () => {
    setFormData({
      vehicleId: availableVehicles[0]?.id || '',
      type: 'service',
      cost: '',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleId || !formData.cost || !formData.description.trim()) {
      triggerToast('All fields are required.', 'error');
      return;
    }
    if (Number(formData.cost) < 0) {
      triggerToast('Maintenance cost must be non-negative.', 'error');
      return;
    }

    const vehicleObj = vehicles.find(v => v.id === formData.vehicleId);
    const vehicleName = vehicleObj ? vehicleObj.name : 'Unknown';

    const success = await addMaintenance({
      vehicleId: formData.vehicleId,
      vehicleName,
      title: `${vehicleName}: ${formData.description}`,
      description: formData.description,
      type: formData.type,
      cost: Number(formData.cost),
      date: new Date().toISOString().split('T')[0]
    });

    if (success) {
      setShowAddModal(false);
    }
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    updateMaintenanceStatus(taskId, newStatus);
  };

  return (
    <div className="flex flex-col h-full space-y-gutter">
      
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Maintenance Board</h2>
          <p className="text-body-md text-on-surface-variant">Real-time status of fleet repairs and inspections</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => triggerToast('Maintenance log checklist filtered.', 'info')}
            className="px-unit-md py-2 border border-outline-variant rounded-lg text-body-md font-medium hover:bg-surface-container-lowest transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] select-none">filter_list</span> 
            Filter
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="px-unit-md py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] select-none">add</span> 
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-gutter h-full min-w-[1000px] items-stretch select-none">
          
          {/* Scheduled Column */}
          <div className="flex-1 flex flex-col min-w-[320px] max-w-[400px]">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline"></span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Scheduled</h3>
                <span className="px-2 py-0.5 bg-surface-container-high rounded text-label-sm font-label-md text-on-surface-variant">
                  {scheduledTasks.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div 
              className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-6"
              style={{ minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)' }}
            >
              {scheduledTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-primary group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed text-label-sm font-label-md rounded font-semibold font-mono">
                      {task.id}
                    </span>
                  </div>
                  <h4 className="font-body-lg text-on-surface font-bold mb-1">{task.title}</h4>
                  <p className="text-body-md text-on-surface-variant mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-3">
                    <span className="font-body-md text-primary font-bold font-mono">₹{task.cost}</span>
                    <button 
                      onClick={() => handleTaskStatusChange(task.id, 'In Progress')}
                      className="px-2.5 py-1 bg-primary-container text-white text-xs font-bold rounded shadow-sm hover:opacity-90 transition-all"
                    >
                      Start Work
                    </button>
                  </div>
                </div>
              ))}
              {scheduledTasks.length === 0 && (
                <p className="text-body-md text-outline italic text-center p-4">No scheduled repairs.</p>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex-1 flex flex-col min-w-[320px] max-w-[400px]">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-surface-tint"></span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">In Progress</h3>
                <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded text-label-sm font-label-md">
                  {inProgressTasks.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div 
              className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-6"
              style={{ minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)' }}
            >
              {inProgressTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-surface-container-lowest border border-primary/30 rounded-xl p-unit-md shadow-md transition-all duration-300 relative overflow-hidden ring-2 ring-primary/10"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <div className="animate-pulse flex items-center gap-1 text-primary text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> ACTIVE
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-primary-container text-white text-label-sm font-label-md rounded font-mono">
                      {task.id}
                    </span>
                  </div>
                  <h4 className="font-body-lg text-on-surface font-bold mb-1">{task.title}</h4>
                  <p className="text-body-md text-on-surface-variant mb-4">{task.description}</p>
                  
                  {task.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-label-sm font-label-md text-outline mb-1 font-medium">
                        <span>Completion</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${task.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-3">
                    <span className="font-body-md text-primary font-bold font-mono">₹{task.cost}</span>
                    <button 
                      onClick={() => completeMaintenance(task.id, task.cost)}
                      className="px-2.5 py-1 bg-secondary text-white text-xs font-bold rounded shadow-sm hover:opacity-90 transition-all cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-body-md text-outline italic text-center p-4">No tasks in progress.</p>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex-1 flex flex-col min-w-[320px] max-w-[400px]">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <h3 className="font-title-md text-title-md text-on-surface font-semibold">Completed</h3>
                <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-label-sm font-label-md">
                  {completedTasks.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div 
              className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-6"
              style={{ minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)' }}
            >
              {completedTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-surface-container-lowest/60 border border-outline-variant/50 rounded-xl p-unit-md shadow-none opacity-85 hover:opacity-100 transition-all duration-300 grayscale-[0.3] hover:grayscale-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-label-sm font-label-md rounded font-mono font-semibold">
                      {task.id}
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[20px] select-none">
                      check_circle
                    </span>
                  </div>
                  <h4 className="font-body-lg text-on-surface font-bold mb-1 line-through decoration-outline-variant">
                    {task.title}
                  </h4>
                  <p className="text-body-md text-on-surface-variant mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3 mt-3">
                    <span className="text-label-sm font-bold text-secondary uppercase font-mono">
                      {task.date || 'COMPLETED'}
                    </span>
                    <span className="font-body-md text-outline font-bold font-mono">₹{task.cost}</span>
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <p className="text-body-md text-outline italic text-center p-4">No completed tasks yet.</p>
              )}
            </div>
          </div>

          {/* Empty Add Column */}
          <div className="w-20 flex items-start pt-12">
            <button 
              onClick={handleOpenAddModal}
              className="w-full h-12 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating QR scanner */}
      <button 
        onClick={() => triggerToast('QR Code Scanner activated (camera preview overlay mock).', 'info')}
        className="fixed bottom-unit-lg right-unit-lg w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px] select-none">qr_code_scanner</span>
      </button>

      {/* Schedule Maintenance Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold border-b border-outline-variant/30 pb-2">
              Schedule Maintenance
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 text-on-surface">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Available Fleet Vehicle *</label>
                <select 
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  required
                >
                  <option value="" disabled>-- Select Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-[11px] text-error font-medium mt-1">No Available vehicles left in Depot.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Service Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                  >
                    <option value="service">Routine Service</option>
                    <option value="repair">Mechanical Repair</option>
                    <option value="maint">General Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Estimated Cost ($) *</label>
                  <input 
                    type="number" 
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="e.g. 250" 
                    className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">Description / Task Notes *</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe repair or safety check requirements..." 
                  className="w-full bg-white border border-outline-variant rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary text-body-md h-24 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-body-md font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={availableVehicles.length === 0}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;
