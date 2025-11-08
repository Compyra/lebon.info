**Docker Swarm Mode** is Docker’s native clustering and orchestration solution. It allows you to manage a group of Docker nodes as a single virtual system, enabling high availability, load balancing, and simplified deployment of containerized applications.

Key features:
- Built-in orchestration
- Declarative service model
- Rolling updates
- Auto-scaling and self-healing
- Secure node communication via TLS

## 📌 Swarm Initialization

- **Initialize Swarm**
  ```bash
  docker swarm init
  ```

- **Join Swarm (on worker/manager node)**
  ```bash
  docker swarm join-token worker
  ```

- **Leave Swarm**
  ```bash
  docker swarm leave
  ```

- **Force Leave (on manager)**
  ```bash
  docker swarm leave --force
  ```

## 👥 Node Management

- **List nodes**
  ```bash
  docker node ls
  ```

- **Promote node to manager**
  ```bash
  docker node promote <node-name>
  ```

- **Demote node to worker**
  ```bash
  docker node demote <node-name>
  ```

- **Inspect node**
  ```bash
  docker node inspect <node-name> --pretty
  ```

- **Drain node (prevent scheduling)**
  ```bash
  docker node update --availability drain <node-name>
  ```

- **Activate node**
  ```bash
  docker node update --availability active <node-name>
  ```

## 🧠 Manager Nodes

Manager nodes are responsible for:
- Orchestrating tasks and services
- Maintaining cluster state
- Handling API requests

You can have multiple managers for high availability, but only one is the **leader** at any time.

- **Check manager status**
  ```bash
  docker node ls
  ```

- **View Raft consensus info**
  ```bash
  docker swarm inspect
  ```

## 📦 Service Management

- **Create service**
  ```bash
  docker service create --name <service-name> <image>
  ```

- **Create service with replicas**
  ```bash
  docker service create --name <service-name> --replicas <n> <image>
  ```

- **List services**
  ```bash
  docker service ls
  ```

- **Inspect service**
  ```bash
  docker service inspect <service-name> --pretty
  ```

- **Scale service**
  ```bash
  docker service scale <service-name>=<n>
  ```

- **Update service**
  ```bash
  docker service update --image <new-image> <service-name>
  ```

- **Remove service**
  ```bash
  docker service rm <service-name>
  ```

## 🔁 Replicas

Replicas define how many instances of a service should run across the swarm.

- **Set replicas when creating a service**
  ```bash
  docker service create --replicas 5 --name myapp myimage
  ```

- **Scale replicas**
  ```bash
  docker service scale myapp=10
  ```

Swarm automatically distributes replicas across available nodes and restarts them if they fail.

## 🐝 Task & Container Management

- **List tasks of a service**
  ```bash
  docker service ps <service-name>
  ```

- **List all tasks**
  ```bash
  docker node ps <node-name>
  ```

- **List containers**
  ```bash
  docker container ls
  ```

- **Inspect container**
  ```bash
  docker container inspect <container-id>
  ```

## 🌐 Networking

### 🧠 What Is an Overlay Network?
An overlay network is a virtual network that spans across multiple Docker hosts. It allows containers running on different nodes

### Commands

- **Create overlay network**
  ```bash
  docker network create --driver overlay <network-name>
  ```

- **List networks**
  ```bash
  docker network ls
  ```

- **Attach service to network**
  ```bash
  docker service create --name <service-name> --network <network-name> <image>
  ```

## 🛠 Useful Flags

| Flag | Description |
|------|-------------|
| `--replicas` | Number of service instances |
| `--publish` | Port mapping (`<host>:<container>`) |
| `--mount` | Volume mounting |
| `--constraint` | Node placement rules |
| `--update-delay` | Delay between updates |
| `--limit-cpu` / `--limit-memory` | Resource limits |

## 📄 Example: Create a Web Service

```bash
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  --network webnet \
  nginx
```