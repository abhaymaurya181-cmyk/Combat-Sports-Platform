# ArgoCD Installation & Setup

## 1. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for all pods to be ready:

```bash
kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=120s
```

## 2. Access the ArgoCD UI

### Option A: Port-forward (local dev)

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open https://localhost:8080 in your browser.

### Option B: LoadBalancer (production)

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
kubectl get svc argocd-server -n argocd
```

## 3. Get the initial admin password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

Login with username `admin` and the password above.

## 4. Login via CLI

```bash
argocd login localhost:8080 --username admin --password <password> --insecure
```

## 5. Add your Git repository

```bash
argocd repo add https://github.com/your-org/combat-sports-intelligence.git \
  --username <user> \
  --password <token>
```

Or use SSH:

```bash
argocd repo add git@github.com:your-org/combat-sports-intelligence.git \
  --ssh-private-key-path ~/.ssh/id_ed25519
```

## 6. Apply the App-of-Apps manifest

```bash
kubectl apply -f infra/k8s/argocd/app-of-apps.yaml
```

This registers the root Application which then auto-discovers all Helm charts under `infra/helm/`.

## 7. Sync applications

```bash
argocd app sync combat-sports-root
```

Or enable auto-sync in the Application manifests.

## Upgrade ArgoCD

```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.11.0/manifests/install.yaml
```
