import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  //state for upload model
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  //Confirmation for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("PLease provide a title and file");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload Failed.");
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) {
      return;
    }
    setDeleting(true);

    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-100">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-md shadow-violet-600/90 mb-6">
              <FileText className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight mb-6">
              No Documents Yet
            </h3>
            <p className="text-sm text-white mb-6">
              Upload documents to get started!
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/*subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#6d28d9_1px,transparent_1px)] bg-size-[16px_16px] opacity-5 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        {/*Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-white tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-white text-sm">
              Manage and organize your learning materials
            </p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {renderContent()}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-slate-950/50 p-8">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
              onClick={() => setIsUploadModalOpen(false)}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white tracking-tight">
                Upload New Document
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Add a PDF document to your library
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleFileUpload}>
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Document Title
                </label>
                <input
                  className="w-full h-12 px-4 border-2 border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-violet-500 focus:bg-slate-900 focus:shadow-lg focus:shadow-violet-500/10"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  placeholder="e.g. React Interview Tips"
                />
              </div>

              {/* File */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  PDF File
                </label>
                <div className="relative border-2 border-dashed border-slate-600 rounded-xl bg-slate-900/50 hover:border-violet-500 hover:bg-violet-500/5 transition-all duration-200">
                  <input
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center justify-center py-10 px-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                      <Upload
                        className="w-7 h-7 text-violet-400"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-1">
                      {uploadFile ? (
                        <span className="text-violet-400">
                          {uploadFile.name}
                        </span>
                      ) : (
                        <>
                          <span className="text-violet-400">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF files only, max size 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 h-11 px-4 border-2 border-slate-600 rounded-xl bg-transparent text-slate-300 text-sm font-semibold hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 h-11 px-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Deleting Modal */}
      {isDeleteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-lg bg-slate-800/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl shadow-slate-950/50 p-8">
          {/*Close button */}
          <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-medium text-white tracking-tight">
              Confirm Deletetion
            </h2>
          </div>

          <p className="text-md mb-6 text-white">
            Are you sure you want to delete:{" "}
            <span className="font-semibold text-white">{selectedDoc?.title}</span>? This
            action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">  
            <button
              className="flex-1 h-11 px-4 border-2 border-slate-600 rounded-xl bg-transparent text-slate-300 text-sm font-semibold hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="flex-1 h-11 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              type="submit"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default DocumentListPage;
