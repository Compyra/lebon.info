## 📦 ZFS Pool Basics

```bash
# Create a new pool
zpool create mypool /dev/sdX

# List all pools
zpool list

# Show detailed pool status
zpool status mypool

# Add a new vdev to an existing pool
zpool add mypool /dev/sdY

# Destroy a pool (⚠️ irreversible!)
zpool destroy mypool

# Export (unmount) a pool
zpool export mypool

# Import (mount) a pool
zpool import mypool

# Scrub a pool (check for errors)
zpool scrub mypool

# Check scrub status
zpool status mypool
```

## 🛠️ Vdev Types & RAID Equivalents

| ZFS Vdev Type         | Description                                      | RAID Equivalent     | Min Disks | Fault Tolerance |
|-----------------------|--------------------------------------------------|----------------------|-----------|------------------|
| `stripe`              | Data striped across disks, no redundancy         | RAID 0               | 1         | 0                |
| `mirror`              | Identical copies on multiple disks               | RAID 1               | 2+        | 1 per mirror     |
| `raidz1`              | Single parity                                    | RAID 5               | 3+        | 1                |
| `raidz2`              | Double parity                                    | RAID 6               | 4+        | 2                |
| `raidz3`              | Triple parity                                    | RAID 7 (uncommon)    | 5+        | 3                |

> ⚠️ ZFS pools are built from one or more vdevs. If any vdev fails, the entire pool fails—even if other vdevs are healthy.

## 📁 Dataset & Filesystem Management

```bash
# Create a dataset
zfs create mypool/mydataset

# List datasets
zfs list

# Set quota on a dataset
zfs set quota=10G mypool/mydataset

# Snapshot a dataset
zfs snapshot mypool/mydataset@snap1

# Roll back to a snapshot
zfs rollback mypool/mydataset@snap1

# Send snapshot to another system
zfs send mypool/mydataset@snap1 | ssh user@host zfs receive backup/mirror
```

## 🧮 Tips & Best Practices

- ✅ Always use whole disks (not partitions) for ZFS.
- ✅ Use ECC RAM if possible—ZFS relies heavily on memory integrity.
- ✅ Avoid mixing vdev types in a single pool.
- ✅ Use `zpool scrub` regularly to detect and fix silent corruption.
- ✅ Remember: redundancy is at the vdev level, not the pool level.