#!/bin/bash

# Variables
SERVER_USER="i56lxrcy870n"
SERVER_IP="132.148.178.160"
SERVER_PATH="/home/i56lxrcy870n/public_html"
LOCAL_BUILD_PATH="./build"
RENAMED_BUILD_PATH="./extranet"
SSH_KEY="~/.ssh/teddy_key"

# Build le projet
echo "Exécution de npm run build..."
npm run build

# Renommer le dossier de build
if [ -d "$LOCAL_BUILD_PATH" ]; then
    echo "Renommage du dossier build en $RENAMED_BUILD_PATH..."
    mv "$LOCAL_BUILD_PATH" "$RENAMED_BUILD_PATH"
else
    echo "Erreur : Le dossier build n'existe pas. Vérifiez que npm run build s'est exécuté correctement."
    exit 1
fi

# Suppression des anciens fichiers
echo "Suppression des anciens fichiers sur le serveur..."
ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" "bash $SERVER_PATH/delete-old-extranet.sh"

# Synchronisation des fichiers avec le serveur
echo "Déploiement des fichiers vers le serveur..."
rsync -avz -e "ssh -i $SSH_KEY" "$RENAMED_BUILD_PATH" "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

# Extraction des fichiers 
ssh -i $SSH_KEY "$SERVER_USER@$SERVER_IP" "cp -r /home/i56lxrcy870n/public_html/extranet/* /home/i56lxrcy870n/public_html"

# Nettoyage (optionnel)
echo "Suppression du dossier renommé localement..."
rm -rf "$RENAMED_BUILD_PATH"

echo "Déploiement terminé avec succès !"