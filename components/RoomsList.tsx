"use client"

export default function RoomsList({ rooms, user, onRoomClick }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Rooms</h2>
      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No rooms yet. Create or join one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onRoomClick(room.id)}
              className="bg-navy-800/50 border border-navy-700 rounded-xl p-4 hover:bg-navy-700/50 cursor-pointer transition-all hover:border-blue-500"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold flex-1">{room.name}</h3>
                <span className="text-xs bg-navy-900 text-blue-400 px-2 py-1 rounded">{room.key}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {room.members.length} member{room.members.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1 overflow-hidden">
                {room.members.slice(0, 3).map((member, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-navy-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-navy-600"
                    title={`${member.firstName} ${member.lastName}`}
                  >
                    {member.initials}
                  </div>
                ))}
                {room.members.length > 3 && (
                  <div className="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center text-gray-400 text-xs border border-navy-600">
                    +{room.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
