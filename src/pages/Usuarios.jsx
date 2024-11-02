import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  Paper,
  Button,
  Container,
  TextField,
  IconButton,
  Toolbar,
  ButtonGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Tooltip,
  Fade,
  Chip,
  Grid,
  Avatar,
  Zoom,
  useTheme
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Search as SearchIcon,
  PersonOutline as PersonIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Save as SaveIcon
  
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import api from "../_service/api";
import MenuComponent from '../components/Menu';

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: '16px',
  fontWeight: 500,
  ...(status === 'active' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'inactive' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '28px',
    transition: theme.transitions.create(['box-shadow']),
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '28px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.dark,
  width: 50,
  height: 50,
}));

const ListarUsuarios = () => {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [activateConfirmOpen, setActivateConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: ''
  });

  // Animação para os cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };
  useEffect(() => {
    buscarUsuarios();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      filterUsuarios();
    }
  }, [searchTerm, usuarios, statusFilter, isLoading]);

  const buscarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/todosusuarios");
      if (response && response.data) {
        setUsuarios(response.data);
        setFilteredUsuarios(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Não foi possível carregar os usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsuarios = () => {
    if (!usuarios) return;

    let filtered = [...usuarios];

    if (statusFilter === 'ativos') {
      filtered = filtered.filter(usuario => !usuario.deleted_at);
    } else if (statusFilter === 'inativos') {
      filtered = filtered.filter(usuario => usuario.deleted_at);
    }

    filtered = filtered.filter(usuario => 
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsuarios(filtered);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/apagarusuarios/${selectedUser}`);
      toast.success('Usuário removido com sucesso');
      setSelectedUser(null);
      setDeleteConfirmOpen(false);
      buscarUsuarios();
    } catch (error) {
      toast.error('Erro ao remover usuário');
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleEdit = () => {
    if (!selectedUser) {
      toast.warning('Selecione um usuário para editar');
      return;
    }

    const usuario = usuarios.find(u => u.id === selectedUser);
    if (usuario) {
      setEditForm({
        nome: usuario.nome,
        email: usuario.email
      });
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.nome || !editForm.email) {
      toast.warning('Preencha todos os campos');
      return;
    }
    setUpdateConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      await api.patch(`/atualizarusuarios/${selectedUser}`, editForm);
      toast.success('Usuário atualizado com sucesso');
      setUpdateConfirmOpen(false);
      setEditModalOpen(false);
      buscarUsuarios();
      setSelectedUser(null);
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleActivateUser = () => {
    setActivateConfirmOpen(true);
  };

  const handleConfirmActivate = async () => {
    const usuario = usuarios.find(u => u.id === selectedUser);
    try {
      await api.patch(`/atualizarusuarios/${selectedUser}`, {
        nome: usuario.nome,
        email: usuario.email
      });
      toast.success('Usuário ativado com sucesso');
      setActivateConfirmOpen(false);
      setEditModalOpen(false);
      buscarUsuarios();
      setSelectedUser(null);
    } catch (error) {
      toast.error('Erro ao ativar usuário');
    }
  };

  const handleCardClick = (userId) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  const isSelectedUserInactive = () => {
    if (!selectedUser || !usuarios) return false;
    const usuario = usuarios.find(u => u.id === selectedUser);
    return usuario?.deleted_at || false;
  };

  return (
    <>
      <MenuComponent />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                textAlign: 'center', 
                color: theme.palette.primary.main,
                fontWeight: 700,
                mb: 4
              }}
            >
              Gestão de Usuários
            </Typography>
          </motion.div>

          <Paper 
            elevation={0}
            sx={{ 
              mb: 3, 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <SearchField
                  fullWidth
                  size="medium"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                  <Tooltip title="Filtrar por status">
                    <ButtonGroup variant="outlined" size="medium">
                      <ActionButton 
                        onClick={() => setStatusFilter('ativos')}
                        variant={statusFilter === 'ativos' ? 'contained' : 'outlined'}
                      >
                        Ativos
                      </ActionButton>
                      <ActionButton 
                        onClick={() => setStatusFilter('inativos')}
                        variant={statusFilter === 'inativos' ? 'contained' : 'outlined'}
                      >
                        Inativos
                      </ActionButton>
                      <ActionButton 
                        onClick={() => setStatusFilter('todos')}
                        variant={statusFilter === 'todos' ? 'contained' : 'outlined'}
                      >
                        Todos
                      </ActionButton>
                    </ButtonGroup>
                  </Tooltip>
                  <Tooltip title="Atualizar lista">
                    <IconButton onClick={buscarUsuarios} color="primary">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

            {selectedUser && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Editar usuário">
                  <span>
                    <IconButton 
                      color="primary" 
                      onClick={handleEdit}
                      disabled={!selectedUser}
                    >
                      <EditIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Excluir usuário">
                  <span>
                    <IconButton 
                      color="error" 
                      onClick={handleDelete}
                      disabled={!selectedUser || isSelectedUserInactive()}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Paper>

          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 400 
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <AnimatePresence>
              <Grid container spacing={2}>
                {filteredUsuarios.map((usuario) => (
                  <Grid item xs={12} sm={6} md={4} key={usuario.id}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <StyledCard 
                        onClick={() => handleCardClick(usuario.id)}
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: selectedUser === usuario.id ? 'action.selected' : 'background.paper'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <UserAvatar>
                              {usuario.nome.charAt(0).toUpperCase()}
                            </UserAvatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h6" color="primary">
                                {usuario.nome}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {usuario.email}
                              </Typography>
                            </Box>
                          </Box>
                          <StatusChip
                            label={usuario.deleted_at ? "Inativo" : "Ativo"}
                            status={usuario.deleted_at ? 'inactive' : 'active'}
                            size="small"
                            icon={usuario.deleted_at ? <ClearIcon /> : <CheckIcon />}
                          />
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>
          )}

          {!isLoading && filteredUsuarios.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper 
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  mt: 4,
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum usuário encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tente ajustar os filtros ou fazer uma nova busca
                </Typography>
              </Paper>
            </motion.div>
          )}

          {/* Modais de confirmação com design aprimorado */}
          <Dialog 
            open={editModalOpen} 
            onClose={() => setEditModalOpen(false)}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
          >
            <DialogTitle sx={{ pb: 0 }}>
              <Typography variant="h6" component="div">
                {isSelectedUserInactive() ? 'Ativar Usuário' : 'Editar Usuário'}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {isSelectedUserInactive() ? (
                <Box sx={{ pt: 2 }}>
                  <DialogContentText sx={{ mb: 3 }}>
                    Este usuário está inativo. Deseja reativá-lo?
                  </DialogContentText>
                  <TextField
                    label="Nome"
                    fullWidth
                    value={editForm.nome}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={editForm.email}
                    disabled
                  />
                </Box>
              ) : (
                <Box sx={{ pt: 2 }}>
                  <TextField
                    label="Nome"
                    fullWidth
                    value={editForm.nome}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={() => setEditModalOpen(false)}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
              {isSelectedUserInactive() ? (
                <Button 
                  onClick={handleActivateUser}
                  variant="contained"
                  color="primary"
                  startIcon={<CheckIcon />}
                >
                  Ativar Usuário
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveEdit}
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                >
                  Salvar Alterações
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Diálogos de confirmação */}
          <Dialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            TransitionComponent={Zoom}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon color="error" />
                <Typography variant="h6">Confirmar Exclusão</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Esta ação não poderá ser desfeita. Deseja realmente excluir este usuário?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={() => setDeleteConfirmOpen(false)}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteConfirm}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={updateConfirmOpen}
            onClose={() => setUpdateConfirmOpen(false)}
            TransitionComponent={Zoom}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SaveIcon color="primary" />
                <Typography variant="h6">Confirmar Alterações</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Deseja salvar as alterações realizadas?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={() => setUpdateConfirmOpen(false)}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmUpdate}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Salvar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={activateConfirmOpen}
            onClose={() => setActivateConfirmOpen(false)}
            TransitionComponent={Zoom}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon color="success" />
                <Typography variant="h6">Confirmar Ativação</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Deseja reativar este usuário?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={() => setActivateConfirmOpen(false)}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmActivate}
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
              >
                Ativar
              </Button>
            </DialogActions>
          </Dialog>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Box>
      </Container>
    </>
  );
};

export default ListarUsuarios;






