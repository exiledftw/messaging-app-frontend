"use client"

type Member = {
  firstName: string
  lastName: string
  initials: string
}

type Room = {
  id: string | number
  name: string
  key: string
  members?: Member[]
}

type Props = {
  rooms: Room[]
  user: any
  onRoomClick: (roomId: string | number) => void
}

export default function RoomsList({ rooms, user, onRoomClick }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Rooms</h2>
        <span className="text-white/40 text-sm">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</span>
      </div>
      
      {rooms.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-500/10 to-violet-500/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-white/80 font-semibold text-xl mb-2">No rooms yet</h3>
          <p className="text-white/40 max-w-sm mx-auto">Create a new room or join an existing one using a room key to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rooms.map((room: Room, idx: number) => (
            <div
              key={room.id}
              onClick={() => onRoomClick(room.id)}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-violet-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-violet-500/5 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <span className="text-white font-bold text-lg">{room.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-pink-300 transition-colors">{room.name}</h3>
                      <p className="text-white/50 text-sm">
                        {room.members?.length || 0} member{(room.members?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Room Key Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg">
                    <span className="text-white/40 text-xs">Key:</span>
                    <span className="text-pink-400 font-mono font-bold text-sm">{room.key}</span>
                  </div>
                  
                  {/* Member Avatars */}
                  <div className="flex items-center -space-x-2">
                    {room.members?.slice(0, 3).map((member: Member, idx: number) => (
                      <div
                        key={idx}
                        className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-violet-950 shadow-md"
                        title={`${member.firstName} ${member.lastName}`}
                      >
                        {member.initials}
                      </div>
                    ))}
                    {(room.members?.length || 0) > 3 && (
                      <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 text-xs font-medium border-2 border-violet-950">
                        +{room.members!.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enter Room indicator */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white/50 text-sm">Enter room</span>
                  <svg className="w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
