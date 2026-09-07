class DevicePathTracker {
  constructor(maxPaths = 20) {
    this.maxPaths = maxPaths
    this.paths = []
    this.currentPath = []
  }

  // Add new coordinates to the current path
  addCoordinates(latitude, longitude, isOnline) {
    if (!isOnline) {
      // If device goes offline, save the current path if it exists
      if (this.paths.length > 0) {
        this.savePath()
      }

      // if (this.currentPath.length === 0) {
        this.paths.push([])
      // }
      return
    }

    // Add new coordinates to current path
    // this.currentPath.push({
    //   latitude,
    //   longitude,
    //   timestamp: new Date(),
    // })
    this.paths[this.paths.length-1]=[...this.paths[this.paths.length-1],{
      latitude,
      longitude,
      timestamp: new Date(),
    }]
  }

  // Save the current path and manage the paths array
  savePath() {
    // if (this.currentPath.length > 0) {
      // Add the current path to paths array
      // this.paths.push([...this.currentPath])

      // Keep only the last maxPaths paths
      if (this.paths.length > this.maxPaths) {
        this.paths.shift() // Remove the oldest path
      }

      // Clear the current path
      // this.currentPath = []
    // }
  }

  // savePath() {
  //   if (this.currentPath.length > 0) {
  //     // Add the current path to paths array
  //     this.paths.push([...this.currentPath])
  //
  //     // Keep only the last maxPaths paths
  //     if (this.paths.length > this.maxPaths) {
  //       this.paths.shift() // Remove the oldest path
  //     }
  //
  //     // Clear the current path
  //     this.currentPath = []
  //   }
  // }

  // Get all stored paths
  getAllPaths() {
    return this.paths
  }


  setAllPaths(paths) {
    this.paths = paths
  }

  // Get the current path
  getCurrentPath() {
    return this.currentPath
  }

  // Clear all paths
  clearAllPaths() {
    this.paths = []
    this.currentPath = []
  }
}

export default DevicePathTracker
// Example usage:
/*
const tracker = new DevicePathTracker();

// Simulating device movement
tracker.addCoordinates(35.6892, 51.3890, true);  // Online
tracker.addCoordinates(35.6893, 51.3891, true);  // Online
tracker.addCoordinates(35.6894, 51.3892, false); // Offline - will save current path
tracker.addCoordinates(35.6895, 51.3893, true);  // Online - starts new path

// Get all stored paths
const allPaths = tracker.getAllPaths();
console.log(allPaths);
*/
