'use client';

import { useState, useEffect } from 'react';
import { Train, Clock, MapPin, Users, Calendar, Plus, Search, Filter, ChevronRight, Info, AlertCircle } from 'lucide-react';

interface TrainData {
  id: string;
  number: string;
  name: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding';
  departure: string;
  arrival: string;
  from: string;
  to: string;
  platform: string;
  capacity: number;
  occupied: number;
  delay?: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'live' | 'manage'>('schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'delayed' | 'ontime'>('all');
  const [trains, setTrains] = useState<TrainData[]>([
    {
      id: '1',
      number: 'EXP-101',
      name: 'Express Premier',
      status: 'On Time',
      departure: '08:30',
      arrival: '14:45',
      from: 'New York',
      to: 'Boston',
      platform: 'A3',
      capacity: 400,
      occupied: 342,
    },
    {
      id: '2',
      number: 'RAP-205',
      name: 'Rapid Transit',
      status: 'Delayed',
      departure: '09:15',
      arrival: '11:30',
      from: 'Chicago',
      to: 'Detroit',
      platform: 'B7',
      capacity: 300,
      occupied: 287,
      delay: 25,
    },
    {
      id: '3',
      number: 'LOC-403',
      name: 'Local Express',
      status: 'Boarding',
      departure: '10:00',
      arrival: '16:20',
      from: 'Los Angeles',
      to: 'San Francisco',
      platform: 'C2',
      capacity: 500,
      occupied: 456,
    },
    {
      id: '4',
      number: 'INT-701',
      name: 'Interstate Fast',
      status: 'On Time',
      departure: '11:45',
      arrival: '19:10',
      from: 'Seattle',
      to: 'Portland',
      platform: 'A5',
      capacity: 350,
      occupied: 198,
    },
    {
      id: '5',
      number: 'EXP-309',
      name: 'Coast Express',
      status: 'Cancelled',
      departure: '13:20',
      arrival: '18:55',
      from: 'Miami',
      to: 'Orlando',
      platform: '-',
      capacity: 450,
      occupied: 0,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTrain, setNewTrain] = useState<Partial<TrainData>>({
    status: 'On Time',
    capacity: 400,
    occupied: 0,
  });

  const filteredTrains = trains.filter(train => {
    const matchesSearch =
      train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.to.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'delayed' && train.status === 'Delayed') ||
      (selectedFilter === 'ontime' && train.status === 'On Time');

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: TrainData['status']) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Boarding': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTrain = () => {
    if (newTrain.name && newTrain.number && newTrain.from && newTrain.to) {
      const train: TrainData = {
        id: Date.now().toString(),
        number: newTrain.number,
        name: newTrain.name,
        status: newTrain.status as TrainData['status'],
        departure: newTrain.departure || '00:00',
        arrival: newTrain.arrival || '00:00',
        from: newTrain.from,
        to: newTrain.to,
        platform: newTrain.platform || 'TBA',
        capacity: newTrain.capacity || 400,
        occupied: newTrain.occupied || 0,
      };
      setTrains([...trains, train]);
      setShowAddModal(false);
      setNewTrain({ status: 'On Time', capacity: 400, occupied: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Train Management</h1>
                <p className="text-xs text-gray-500">System Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Train</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
          {(['schedule', 'live', 'manage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trains, stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'delayed', 'ontime'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'delayed' ? 'Delayed' : 'On Time'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Trains</p>
                <p className="text-2xl font-bold text-gray-900">{trains.length}</p>
              </div>
              <Train className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">On Time</p>
                <p className="text-2xl font-bold text-green-600">
                  {trains.filter(t => t.status === 'On Time').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Delayed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {trains.filter(t => t.status === 'Delayed').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Capacity</p>
                <p className="text-2xl font-bold text-primary-600">
                  {trains.reduce((sum, t) => sum + t.capacity, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Train List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-8">
        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{train.name}</h3>
                      <p className="text-sm text-gray-500">{train.number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(train.status)}`}>
                      {train.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{train.from}</span> → <span className="font-medium">{train.to}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {train.departure} - {train.arrival}
                        {train.delay && <span className="text-yellow-600 ml-1">(+{train.delay}m)</span>}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Train className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">Platform: <span className="font-medium">{train.platform}</span></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {train.occupied}/{train.capacity} ({Math.round((train.occupied / train.capacity) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (train.occupied / train.capacity) > 0.9 ? 'bg-red-500' :
                          (train.occupied / train.capacity) > 0.7 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(train.occupied / train.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button className="sm:ml-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}

          {filteredTrains.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trains found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Train Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Train</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Train Number</label>
                    <input
                      type="text"
                      value={newTrain.number || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="EXP-101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Train Name</label>
                    <input
                      type="text"
                      value={newTrain.name || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Express Premier"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <input
                      type="text"
                      value={newTrain.from || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, from: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input
                      type="text"
                      value={newTrain.to || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, to: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Boston"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time</label>
                    <input
                      type="time"
                      value={newTrain.departure || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, departure: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Time</label>
                    <input
                      type="time"
                      value={newTrain.arrival || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, arrival: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <input
                      type="text"
                      value={newTrain.platform || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, platform: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="A3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      value={newTrain.capacity || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupied</label>
                    <input
                      type="number"
                      value={newTrain.occupied || ''}
                      onChange={(e) => setNewTrain({ ...newTrain, occupied: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newTrain.status}
                    onChange={(e) => setNewTrain({ ...newTrain, status: e.target.value as TrainData['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTrain}
                  className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Train
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
