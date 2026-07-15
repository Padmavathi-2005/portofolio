import prisma from '../../config/db.js';

export const getAllProjects = async () => {
  return await prisma.project.findMany({
    orderBy: { order: 'asc' }
  });
};

export const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id }
  });
};

export const createProject = async (projectData) => {
  return await prisma.project.create({
    data: {
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl || null,
      githubUrl: projectData.githubUrl || null,
      liveUrl: projectData.liveUrl || null,
      tags: projectData.tags || '',
      order: parseInt(projectData.order, 10) || 0
    }
  });
};

export const updateProject = async (id, projectData) => {
  return await prisma.project.update({
    where: { id },
    data: {
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      githubUrl: projectData.githubUrl,
      liveUrl: projectData.liveUrl,
      tags: projectData.tags,
      order: projectData.order !== undefined ? parseInt(projectData.order, 10) : undefined
    }
  });
};

export const deleteProject = async (id) => {
  return await prisma.project.delete({
    where: { id }
  });
};
