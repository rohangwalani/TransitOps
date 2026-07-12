import React, { useState } from 'react';

const Maintenance = () => {
  const [columns, setColumns] = useState([
    {
      id: 'scheduled',
      title: 'Scheduled',
      indicatorColor: 'bg-outline',
      count: '05',
      tasks: [
        {
          id: 'SERVICE-402',
          title: 'Semi-Trailer #45: Brake Inspection',
          description: 'Quarterly safety inspection for the main haulage unit.',
          type: 'service',
          tag: 'SERVICE-402',
          tagClass: 'bg-primary-fixed text-on-primary-fixed',
          leftBorderClass: 'border-l-4 border-l-primary',
          dueDate: 'Oct 24',
          assigneeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVm0y42vlLVgDpz23IrcdRSiAbfQTqu26q-XhrXOlpVOsVDukBIM5VyC2z2yDoFsTdOkuqzREDuj-_KNw42V-k-G3XmgVlMSgXAwFnFtMZGGdL897XLjbuzChYZ5MCkeRdvQBeYnUAi45QgpzgIksdiAgMB6FX8qDx5okARjSH0YB8-F_YlQvD02D-5WYSPm3Z0Q_cjTkUck5vbSvuO7OMqeRQOqOlzzNE4aTBe7P6FSXFHs_XVLyIKg',
          assigneeName: 'Tech 1'
        },
        {
          id: 'REPAIR-129',
          title: 'Ford Transit #09: Oil Change',
          description: 'Standard 15k mile service and fluids check.',
          type: 'repair',
          tag: 'REPAIR-129',
          tagClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
          leftBorderClass: 'border-l-4 border-l-tertiary',
          dueDate: 'Overdue',
          priorityTag: 'High Priority',
          priorityTagClass: 'bg-error-container text-on-error-container',
          overdue: true
        },
        {
          id: 'MAINT-882',
          title: 'Fleet Wash & Detail',
          description: 'Monthly cleaning for East District vehicles.',
          type: 'maint',
          tag: 'MAINT-882',
          tagClass: 'bg-surface-container-high text-on-surface-variant',
          leftBorderClass: 'border-l-4 border-l-outline-variant',
          dueDate: 'Oct 28',
          assigneeCount: '+4'
        }
      ]
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      indicatorColor: 'bg-surface-tint',
      count: '02',
      tasks: [
        {
          id: 'REPAIR-331',
          title: 'Mack Anthem: Transmission',
          description: 'Replacing clutch assembly and fluid flush.',
          type: 'repair',
          tag: 'REPAIR-331',
          tagClass: 'bg-primary-container text-white',
          isActive: true,
          progress: 65,
          timeElapsed: '4h 20m',
          assigneeName: 'M. Rivera',
          assigneeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD093uInelk9Fgn9yWFEeAGH3RjtRKL75-RFqbC0TWISO35U2zyCA1nMF6ffoQ2sZ9Pm-j7R_CU7okNDvHACGTkJ4OXr1ySOU7uTf3gcmWFapaDFgxbuK-QrxjH14CNNmnq1B-LWccqHUX2qNb1YAqZl0FrjCJf5wBnupdXM42ShUJ2bziT8uy0z3C7mpoi43lg-GMnUxuaDMSmKlN0WxM4aF6uBHq5nmVIMk8X2jMMdHkeOJuq-8OeRg'
        },
        {
          id: 'MAINT-102',
          title: 'EV Sprinter: Firmware Update',
          description: 'Updating navigation and battery management systems.',
          type: 'maint',
          tag: 'MAINT-102',
          tagClass: 'bg-primary-fixed text-on-primary-fixed',
          isAutoUpdate: true,
          assigneeName: 'Auto-Update',
          wifiConnected: true
        }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      indicatorColor: 'bg-secondary',
      count: '18',
      tasks: [
        {
          id: 'SERVICE-398',
          title: 'Volvo FH16: Tire Rotation',
          description: 'Complete 12-wheel rotation and alignment check.',
          type: 'service',
          tag: 'SERVICE-398',
          isCompleted: true,
          completedDate: 'COMPLETED OCT 22',
          assigneeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9a2RUOKoRHgBP9i-FLDuskpwtuQbZxwNc9wYSwuCFpp8cy25lRuMRthEwPPwreU-QA0wpLJc8PCqGS7U6fPH9wPKxGtc5FwzXpeuVwNFxwBUlGDDdnPIaHmjFEBG-OH7zrokPKrIhjA2Y2ojOMj9HpUWGCwdL77ucoVAl1pr9a2PJG8vO0AMKHyyYca4l-DXOrJGvhpJCFqo3sT7_fkMAgui2gCLf9h7-V9UbpEm5QpMPTkdI9LNANw'
        },
        {
          id: 'REPAIR-320',
          title: 'Fleet Van #22: Headlight',
          description: 'Replaced shattered driver-side housing.',
          type: 'repair',
          tag: 'REPAIR-320',
          isCompleted: true,
          completedDate: 'COMPLETED OCT 21',
          hasCheckMark: true
        }
      ]
    }
  ]);

  return (
    <div className="flex flex-col h-full space-y-gutter">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Maintenance Board</h2>
          <p className="text-body-md text-on-surface-variant">Real-time status of fleet repairs and inspections</p>
        </div>
        <div className="flex gap-3">
          <button className="px-unit-md py-2 border border-outline-variant rounded-lg text-body-md font-medium hover:bg-surface-container-lowest transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] select-none">filter_list</span> 
            Filter
          </button>
          <button className="px-unit-md py-2 bg-primary text-white rounded-lg text-body-md font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] select-none">add</span> 
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-gutter h-full min-w-[1000px] items-stretch">
          
          {columns.map((column) => (
            <div key={column.id} className="flex-1 flex flex-col min-w-[320px] max-w-[400px]">
              
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2 select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${column.indicatorColor}`}></span>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">{column.title}</h3>
                  <span className="px-2 py-0.5 bg-surface-container-high rounded text-label-sm font-label-md text-on-surface-variant">
                    {column.count}
                  </span>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">
                  more_horiz
                </button>
              </div>

              {/* Column Cards List */}
              <div 
                className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar pb-6"
                style={{ minHeight: 'calc(100vh - 280px)', maxHeight: 'calc(100vh - 280px)' }}
              >
                {column.tasks.map((task) => {
                  const borderClass = task.leftBorderClass || '';
                  
                  if (task.isCompleted) {
                    return (
                      <div 
                        key={task.id}
                        className="bg-surface-container-lowest/60 border border-outline-variant/50 rounded-xl p-unit-md shadow-none opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer grayscale-[0.5] hover:grayscale-0"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-label-sm font-label-md rounded">
                            {task.tag}
                          </span>
                          <span className="material-symbols-outlined text-secondary text-[20px] select-none">
                            check_circle
                          </span>
                        </div>
                        <h4 className="font-body-lg text-on-surface font-bold mb-1 line-through decoration-outline-variant">
                          {task.title}
                        </h4>
                        <p className="text-body-md text-on-surface-variant mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-label-sm font-label-sm text-secondary font-bold uppercase">
                            {task.completedDate}
                          </div>
                          {task.assigneeImage && (
                            <img className="w-6 h-6 rounded-full grayscale border border-outline-variant/30" src={task.assigneeImage} alt="Assignee" />
                          )}
                          {task.hasCheckMark && (
                            <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                              <span className="material-symbols-outlined text-[12px] text-on-secondary-container select-none">
                                done
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={task.id}
                      className={`bg-surface-container-lowest border rounded-xl p-unit-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                        task.isActive 
                          ? 'border-primary/30 ring-2 ring-primary/10' 
                          : 'border-outline-variant'
                      } ${borderClass}`}
                    >
                      {task.isActive && (
                        <div className="absolute top-0 right-0 p-2">
                          <div className="animate-pulse flex items-center gap-1 text-primary text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> ACTIVE
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 text-label-sm font-label-md rounded ${task.tagClass}`}>
                          {task.tag}
                        </span>
                        {!task.isActive && (
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors select-none text-[18px]">
                            open_in_new
                          </span>
                        )}
                      </div>

                      <h4 className="font-body-lg text-on-surface font-bold mb-1 group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-body-md text-on-surface-variant mb-4">{task.description}</p>

                      {/* Progress Bar (For Active In-Progress Tasks) */}
                      {task.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between text-label-sm font-label-md text-outline mb-1 font-medium">
                            <span>Completion</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                        </div>
                      )}

                      {/* Footer telemetry / Assignee details */}
                      <div className="flex items-center justify-between">
                        {task.assigneeImage ? (
                          <div className="flex items-center gap-2">
                            <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" src={task.assigneeImage} alt={task.assigneeName} />
                            {task.assigneeName && (
                              <span className="text-label-sm font-label-sm text-on-surface font-semibold">{task.assigneeName}</span>
                            )}
                          </div>
                        ) : task.isAutoUpdate ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[16px] select-none">psychology</span>
                            </div>
                            <span className="text-label-sm font-label-sm text-on-surface font-semibold">Auto-Update</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {task.assigneeCount && (
                              <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface">
                                {task.assigneeCount}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Timing / Action Status details */}
                        {task.priorityTag ? (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${task.priorityTagClass}`}>
                            {task.priorityTag}
                          </span>
                        ) : task.timeElapsed ? (
                          <div className="flex items-center gap-1 text-outline">
                            <span className="material-symbols-outlined text-[16px] select-none">timer</span>
                            <span className="text-label-sm font-label-sm font-medium">{task.timeElapsed}</span>
                          </div>
                        ) : task.wifiConnected ? (
                          <div className="flex items-center gap-1 text-outline">
                            <span className="material-symbols-outlined text-[16px] select-none">wifi</span>
                            <span className="text-label-sm font-label-sm font-medium">Connected</span>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-1 ${task.overdue ? 'text-error' : 'text-outline'}`}>
                            <span className="material-symbols-outlined text-[16px] select-none">
                              {task.overdue ? 'history' : 'calendar_today'}
                            </span>
                            <span className="text-label-sm font-label-sm font-medium">{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty Add Column */}
          <div className="w-20 flex items-start pt-12">
            <button className="w-full h-12 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all duration-300">
              <span className="material-symbols-outlined select-none">add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-unit-lg right-unit-lg w-14 h-14 bg-primary text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-50 group">
        <span className="material-symbols-outlined text-[28px] select-none">
          qr_code_scanner
        </span>
      </button>
    </div>
  );
};

export default Maintenance;
